import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { ErrorHandler } from '@/core/errors';
import { env } from '@/config/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  const testType = request.nextUrl.searchParams.get('type') || 'connection';

  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase credentials not configured',
          details: {
            hasUrl: !!supabaseUrl,
            hasAnonKey: !!supabaseAnonKey,
            hasServiceKey: !!supabaseServiceKey,
          },
        },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const supabaseAdmin = supabaseServiceKey
      ? getServiceSupabase()
      : null;

    const startTime = Date.now();

    switch (testType) {
      case 'connection':
        // Test basic connection
        const { data: connectionData, error: connectionError } = await supabase
          .from('patients')
          .select('count')
          .limit(1);

        return NextResponse.json({
          success: !connectionError,
          error: connectionError?.message,
          duration: Date.now() - startTime,
          details: {
            connected: !connectionError,
            url: supabaseUrl ? 'Configured' : 'Missing',
            anonKey: supabaseAnonKey ? 'Configured' : 'Missing',
            serviceKey: supabaseServiceKey ? 'Configured' : 'Missing',
          },
        });

      case 'tables':
        // Test table access
        const tables = [
          'patients',
          'appointments',
          'users',
          'sessions',
          'doctors',
          'messages',
        ];

        const tableResults: Record<string, any> = {};

        for (const table of tables) {
          try {
            const { error } = await supabase.from(table).select('count').limit(1);
            tableResults[table] = {
              accessible: !error,
              error: error?.message || null,
            };
          } catch (err: any) {
            tableResults[table] = {
              accessible: false,
              error: err.message,
            };
          }
        }

        return NextResponse.json({
          success: true,
          duration: Date.now() - startTime,
          tables: tableResults,
        });

      case 'query':
        // Test query performance
        const queryStart = Date.now();
        const { data: queryData, error: queryError } = await supabase
          .from('patients')
          .select('id, first_name, last_name, email')
          .limit(10);

        return NextResponse.json({
          success: !queryError,
          error: queryError?.message,
          duration: Date.now() - queryStart,
          totalDuration: Date.now() - startTime,
          rowsReturned: queryData?.length || 0,
        });

      case 'insert':
        // Test insert operation (if we have admin key)
        if (!supabaseAdmin) {
          return NextResponse.json({
            success: false,
            error: 'Service key not configured for insert test',
          });
        }

        const testData = {
          first_name: 'Test',
          last_name: `User_${Date.now()}`,
          email: `test_${Date.now()}@test.com`,
          phone: '0500000000',
        };

        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('patients')
          .insert(testData)
          .select()
          .single();

        if (insertError) {
          return NextResponse.json({
            success: false,
            error: insertError.message,
            duration: Date.now() - startTime,
          });
        }

        // Clean up test data
        if (insertData?.id) {
          await supabaseAdmin.from('patients').delete().eq('id', insertData.id);
        }

        return NextResponse.json({
          success: true,
          duration: Date.now() - startTime,
          testData: insertData,
        });

      case 'update':
        // Test update operation
        if (!supabaseAdmin) {
          return NextResponse.json({
            success: false,
            error: 'Service key not configured for update test',
          });
        }

        // Create test record first
        const { data: createData, error: createError } = await supabaseAdmin
          .from('patients')
          .insert({
            first_name: 'Update',
            last_name: `Test_${Date.now()}`,
            email: `updatetest_${Date.now()}@test.com`,
            phone: '0500000000',
          })
          .select()
          .single();

        if (createError || !createData) {
          return NextResponse.json({
            success: false,
            error: createError?.message || 'Failed to create test record',
            duration: Date.now() - startTime,
          });
        }

        // Update it
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('patients')
          .update({ first_name: 'Updated', last_name: 'Test Name' })
          .eq('id', createData.id)
          .select()
          .single();

        // Clean up
        await supabaseAdmin.from('patients').delete().eq('id', createData.id);

        return NextResponse.json({
          success: !updateError,
          error: updateError?.message,
          duration: Date.now() - startTime,
          updatedData: updateData,
        });

      case 'delete':
        // Test delete operation
        if (!supabaseAdmin) {
          return NextResponse.json({
            success: false,
            error: 'Service key not configured for delete test',
          });
        }

        // Create test record first
        const { data: deleteCreateData, error: deleteCreateError } =
          await supabaseAdmin
            .from('patients')
            .insert({
              first_name: 'Delete',
              last_name: `Test_${Date.now()}`,
              email: `deletetest_${Date.now()}@test.com`,
              phone: '0500000000',
            })
            .select()
            .single();

        if (deleteCreateError || !deleteCreateData) {
          return NextResponse.json({
            success: false,
            error: deleteCreateError?.message || 'Failed to create test record',
            duration: Date.now() - startTime,
          });
        }

        // Delete it
        const { error: deleteError } = await supabaseAdmin
          .from('patients')
          .delete()
          .eq('id', deleteCreateData.id);

        return NextResponse.json({
          success: !deleteError,
          error: deleteError?.message,
          duration: Date.now() - startTime,
        });

      case 'relations':
        // Test foreign key relations
        const relationResults: Record<string, any> = {};

        // Test appointments -> patients relationship
        try {
          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from('appointments')
            .select('patient_id, id')
            .limit(1);
          
          if (!appointmentsError) {
            // Try to join with patients
            if (appointmentsData && appointmentsData.length > 0) {
              const appointment = appointmentsData[0];
              const { data: patientData, error: patientError } = await supabase
                .from('patients')
                .select('id, first_name, last_name')
                .eq('id', appointment.patient_id)
                .single();
              
              relationResults['appointments -> patients'] = {
                working: !patientError,
                error: patientError?.message || null,
                note: patientError ? 'Appointment exists but patient join failed' : 'Join successful',
              };
            } else {
              relationResults['appointments -> patients'] = {
                working: true,
                error: null,
                note: 'Table accessible, no records to test join',
              };
            }
          } else {
            relationResults['appointments -> patients'] = {
              working: false,
              error: appointmentsError.message,
            };
          }
        } catch (err: any) {
          relationResults['appointments -> patients'] = {
            working: false,
            error: err.message,
          };
        }

        // Test if foreign key column exists
        try {
          const { data: fkCheck, error: fkError } = await supabase
            .from('appointments')
            .select('patient_id')
            .limit(1);
          
          relationResults['foreign key column exists'] = {
            working: !fkError,
            error: fkError?.message || null,
            note: !fkError ? 'patient_id column accessible' : 'Column check failed',
          };
        } catch (err: any) {
          relationResults['foreign key column exists'] = {
            working: false,
            error: err.message,
          };
        }

        return NextResponse.json({
          success: true,
          duration: Date.now() - startTime,
          relations: relationResults,
        });

      case 'indexes':
        // Test query performance (implicit index test)
        const indexTests = [
          { table: 'patients', column: 'email' },
          { table: 'appointments', column: 'patient_id' },
          { table: 'appointments', column: 'date' },
        ];

        const indexResults: Record<string, any> = {};

        for (const idx of indexTests) {
          try {
            const idxStart = Date.now();
            const { error } = await supabase
              .from(idx.table)
              .select(idx.column)
              .limit(100);
            const idxDuration = Date.now() - idxStart;

            indexResults[`${idx.table}.${idx.column}`] = {
              performance: idxDuration < 100 ? 'fast' : idxDuration < 500 ? 'medium' : 'slow',
              duration: idxDuration,
              error: error?.message || null,
            };
          } catch (err: any) {
            indexResults[`${idx.table}.${idx.column}`] = {
              performance: 'error',
              error: err.message,
            };
          }
        }

        return NextResponse.json({
          success: true,
          duration: Date.now() - startTime,
          indexes: indexResults,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown test type: ${testType}`,
            availableTypes: [
              'connection',
              'tables',
              'query',
              'insert',
              'update',
              'delete',
              'relations',
              'indexes',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return ErrorHandler.getInstance().handle(error as Error);
  }
}

