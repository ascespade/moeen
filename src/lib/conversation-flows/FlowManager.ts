import { ConversationFlow, FlowStep, ConversationContext, FlowAction } from './types';
import { IntentAnalyzer } from './IntentAnalyzer';
import { ActionExecutor } from './ActionExecutor';

export class FlowManager {
  private flows: Map<string, ConversationFlow> = new Map();
  private intentAnalyzer = new IntentAnalyzer();
  private actionExecutor = new ActionExecutor();

  constructor() {
    this.initializeFlows();
  }

  private initializeFlows() {
    // Appointment booking flow
    this.flows.set('appointment_booking', {
      id: 'appointment_booking',
      name: 'حجز موعد',
      description: 'تدفق حجز المواعيد',
      isActive: true,
      startStep: 'greeting',
      steps: [
        {
          id: 'greeting',
          name: 'الترحيب',
          type: 'response',
          content: 'مرحباً! كيف يمكنني مساعدتك في حجز موعد؟',
          nextStep: 'get_doctor_preference'
        },
        {
          id: 'get_doctor_preference',
          name: 'اختيار الطبيب',
          type: 'question',
          content: 'أي تخصص تفضل؟',
          nextStep: 'get_time_preference'
        },
        {
          id: 'get_time_preference',
          name: 'اختيار الوقت',
          type: 'question',
          content: 'متى تفضل أن يكون الموعد؟',
          nextStep: 'confirm_appointment'
        },
        {
          id: 'confirm_appointment',
          name: 'تأكيد الموعد',
          type: 'action',
          content: 'هل تريد تأكيد هذا الموعد؟',
          actions: [
            {
              type: 'create_appointment',
              data: {
                doctorId: '{{doctorId}}',
                appointmentTime: '{{appointmentTime}}',
                patientId: '{{userId}}',
                notes: 'حجز عبر الشات بوت'
              }
            }
          ],
          nextStep: 'appointment_confirmed'
        },
        {
          id: 'appointment_confirmed',
          name: 'تم تأكيد الموعد',
          type: 'response',
          content: 'تم حجز موعدك بنجاح! ستصلك رسالة تأكيد قريباً.'
        }
      ]
    });

    // Payment inquiry flow
    this.flows.set('payment_inquiry', {
      id: 'payment_inquiry',
      name: 'استفسار الدفع',
      description: 'تدفق استفسارات الدفع',
      isActive: true,
      startStep: 'greeting',
      steps: [
        {
          id: 'greeting',
          name: 'الترحيب',
          type: 'response',
          content: 'مرحباً! كيف يمكنني مساعدتك في استفسارات الدفع؟',
          nextStep: 'get_payment_info'
        },
        {
          id: 'get_payment_info',
          name: 'معلومات الدفع',
          type: 'response',
          content: 'يمكنك الدفع نقداً في العيادة أو عبر البطاقة الائتمانية أو التحويل البنكي.'
        }
      ]
    });

    // General inquiry flow
    this.flows.set('general_inquiry', {
      id: 'general_inquiry',
      name: 'استفسار عام',
      description: 'تدفق الاستفسارات العامة',
      isActive: true,
      startStep: 'greeting',
      steps: [
        {
          id: 'greeting',
          name: 'الترحيب',
          type: 'response',
          content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          nextStep: 'provide_info'
        },
        {
          id: 'provide_info',
          name: 'تقديم المعلومات',
          type: 'response',
          content: 'يمكنني مساعدتك في حجز المواعيد، استفسارات الدفع، التأمين، أو أي استفسار آخر.'
        }
      ]
    });
  }

  getFlow(flowId: string): ConversationFlow | undefined {
    return this.flows.get(flowId);
  }

  getFlowByIntent(intentType: string): ConversationFlow | undefined {
    const flowMapping: Record<string, string> = {
      'book_appointment': 'appointment_booking',
      'payment_inquiry': 'payment_inquiry',
      'insurance_inquiry': 'general_inquiry',
      'general_inquiry': 'general_inquiry',
      'greeting': 'general_inquiry'
    };

    const flowId = flowMapping[intentType];
    return flowId ? this.flows.get(flowId) : undefined;
  }

  getNextStep(flowId: string, currentStepId: string, userMessage: string): FlowStep | null {
    const flow = this.flows.get(flowId);
    if (!flow) return null;

    const currentStep = flow.steps.find(step => step.id === currentStepId);
    if (!currentStep) return null;

    // Handle conditional logic
    if (currentStep.conditions) {
      for (const condition of currentStep.conditions) {
        if (this.evaluateCondition(condition, userMessage)) {
          return flow.steps.find(step => step.id === currentStep.nextStep) || null;
        }
      }
    }

    // Execute actions if this step has them
    if (currentStep.actions) {
      this.executeStepActions(currentStep.actions, userMessage);
    }

    // Return next step
    if (currentStep.nextStep) {
      return flow.steps.find(step => step.id === currentStep.nextStep) || null;
    }

    return null;
  }

  async executeStepAction(step: FlowStep, context: ConversationContext): Promise<any> {
    if (!step.actions) return null;

    const results: Array<{ success: boolean; data?: any; error?: string }> = [];
    for (const action of step.actions) {
      const result = await this.actionExecutor.executeAction(action, context);
      results.push(result);
    }

    return results;
  }

  private async executeStepActions(actions: FlowAction[], userMessage: string): Promise<void> {
    // This would be implemented based on specific action requirements
    console.log('Executing step actions:', actions);
  }

  private evaluateCondition(condition: any, userMessage: string): boolean {
    // Simple condition evaluation logic
    switch (condition.operator) {
      case 'contains':
        return userMessage.toLowerCase().includes(condition.value.toLowerCase());
      case 'equals':
        return userMessage.toLowerCase() === condition.value.toLowerCase();
      default:
        return false;
    }
  }

  async analyzeIntent(message: string) {
    return await this.intentAnalyzer.analyzeIntent(message);
  }
}