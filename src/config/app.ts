// Application configuration
export const appConfig = {
  name: 'مركز الهمم',
  version: '1.0.0',
  description: 'منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
};

export default appConfig;
