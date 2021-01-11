import * as dotenv from 'dotenv';

// initialize environment variables
dotenv.config();

/**
 * Applicant configs.
 */
const config = {
  serviceName: 'insurance-service',
  envName: process.env.ENV_NAME,
  isLocalEnv: process.env.ENV_NAME === 'local',
  testEnvName: process.env.TEST_ENV_NAME || 'test',
  port: process.env.PORT || 3000,
  correlationHeader: 'x-correlation-id',
  cors: {
    origins: process.env.CORS_ALLOWED_ORIGINS || '',
  },
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost/insurance_service',
};

export default config;
