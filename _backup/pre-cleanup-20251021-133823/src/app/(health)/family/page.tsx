'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function FamilyPage() {
  const [family, setFamily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFamily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFamily = async () => {
    try {
      const response = await fetch('/api/family');
      const data = await response.json();
      setFamily(data.family || []);
    } catch (error) {
      console.error('Error loading family:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='p-8'>Loading...</div>;
  }

  return (
    <div className='p-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Family Communication</h1>
        <Button>Add Family Member</Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {family.length === 0 ? (
          <Card className='col-span-full'>
            <div className='p-8 text-center text-gray-500'>
              No family members yet. Add family members to enable communication.
            </div>
          </Card>
        ) : (
          family.map(member => (
            <Card key={member.id}>
              <div className='p-4'>
                <h3 className='font-semibold'>{member.name}</h3>
                <p className='text-sm text-gray-600'>{member.relationship}</p>
                <p className='text-sm text-gray-600'>{member.phone}</p>
                <p className='text-sm text-gray-600'>{member.email}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
