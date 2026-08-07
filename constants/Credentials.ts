import { requireEnv } from '../utils/EnvUtils.js';

export const Credentials = {
  TEST_ACCOUNTS: [
    { email: requireEnv('TEST_ACCOUNT_1_EMAIL'), password: requireEnv('TEST_ACCOUNT_1_PASSWORD') },
    { email: requireEnv('TEST_ACCOUNT_2_EMAIL'), password: requireEnv('TEST_ACCOUNT_2_PASSWORD') },
    { email: requireEnv('TEST_ACCOUNT_3_EMAIL'), password: requireEnv('TEST_ACCOUNT_3_PASSWORD') },
  ],
  REGISTER_ACCOUNT: {
    email: requireEnv('TEST_REGISTER_EMAIL'),
    password: requireEnv('TEST_REGISTER_PASSWORD'),
  },
  DEV_API_URL: requireEnv('DEV_API_URL'),
  BGT_SECRET: requireEnv('BGT_SECRET'),
  API_AUTH_TOKEN: requireEnv('API_AUTH_TOKEN'),
} as const;
