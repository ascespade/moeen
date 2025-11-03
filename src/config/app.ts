// Application configuration
export const appConfig = {
  name: 'مركز الهمم',
  version: '1.0.0',
  description: 'منصة دردشة متعددة القنوات مدعومة بالذكاء الاصطناعي',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
};

export default appConfig;


export const centralConfig = {
  "api": {
    "baseUrl": "/api",
    "timeout": 30000
  },
  "auth": {
    "sessionDuration": 604800000,
    "refreshThreshold": 86400000
  },
  "database": {
    "maxConnections": 10,
    "queryTimeout": 30000
  },
  "ui": {
    "debounceDelay": 300,
    "animationDuration": 200
  }
};
