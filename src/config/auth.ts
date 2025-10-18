// Authentication configuration
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  expiresIn: '7d',
  refreshExpiresIn: '30d',
  maxLoginAttempts: 5,
  lockoutDuration: 15, // minutes
};

export default authConfig;
