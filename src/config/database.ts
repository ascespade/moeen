// Database configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL,
  maxConnections: 10,
  ssl: process.env.NODE_ENV === 'production',
};

export default databaseConfig;
