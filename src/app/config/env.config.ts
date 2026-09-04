import dotenv from 'dotenv';
import AppError from '../errorHelpers/AppError';
import status from 'http-status';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_FROM: string;
  };
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  SSLCOMMERZ: {
    SSL_STORE_ID: string;
    SSL_STORE_PASSWORD: string;
    SSL_IS_LIVE: string;
  };
  OPENROUTER: {
    API_KEY: string;
    API_URL: string;
    MODEL: string;
    FALLBACK_MODEL: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const defaults: Record<string, string> = {
    NODE_ENV: 'development',
    PORT: '5000',
    FRONTEND_URL: 'https://planora-frontend-2kwh.vercel.app',
    BETTER_AUTH_URL: 'https://planora-backend-4bez.vercel.app',
    ACCESS_TOKEN_SECRET: 'Kjs82kLmPq91@xYt45!zWvR7uBnC38',
    REFRESH_TOKEN_SECRET: 'Zp94!LmRt72QaXs8VwE6yUoF1dHjK58',
    ACCESS_TOKEN_EXPIRES_IN: '1d',
    REFRESH_TOKEN_EXPIRES_IN: '30d',
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: '1d',
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: '1d',
    EMAIL_SENDER_SMTP_HOST: 'smtp.gmail.com',
    EMAIL_SENDER_SMTP_PORT: '465',
    SSL_IS_LIVE: 'false',
    SSL_STORE_ID: 'dummy_store',
    SSL_STORE_PASSWORD: 'dummy_password',
  };

  const getEnv = (key: string, fallback = ''): string => {
    const val = process.env[key];
    if (val && val.trim() !== '') return val.trim();
    if (defaults[key]) return defaults[key];
    return fallback;
  };

  const missingCritical: string[] = [];
  if (!process.env.DATABASE_URL) missingCritical.push('DATABASE_URL');
  if (!process.env.BETTER_AUTH_SECRET && !process.env.ACCESS_TOKEN_SECRET) {
    missingCritical.push('BETTER_AUTH_SECRET');
  }

  if (missingCritical.length > 0) {
    console.warn(
      `⚠️ WARNING: Critical environment variables missing: ${missingCritical.join(', ')}`,
    );
  }

  return {
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    PORT: getEnv('PORT', '5000'),
    DATABASE_URL: getEnv(
      'DATABASE_URL',
      'postgresql://neondb_owner:npg_dXRQIqt8B1ST@ep-muddy-math-azkf4lor-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    ),
    FRONTEND_URL: getEnv(
      'FRONTEND_URL',
      'https://planora-frontend-two.vercel.app',
    ),
    BETTER_AUTH_SECRET: getEnv(
      'BETTER_AUTH_SECRET',
      'DOIe2S8PBHlXQRDdumK02RlEWQBdmYUh',
    ),
    BETTER_AUTH_URL: getEnv(
      'BETTER_AUTH_URL',
      'https://planora-backend-4bez.vercel.app',
    ),
    ACCESS_TOKEN_SECRET: getEnv(
      'ACCESS_TOKEN_SECRET',
      'Kjs82kLmPq91@xYt45!zWvR7uBnC38',
    ),
    REFRESH_TOKEN_SECRET: getEnv(
      'REFRESH_TOKEN_SECRET',
      'Zp94!LmRt72QaXs8VwE6yUoF1dHjK58',
    ),
    ACCESS_TOKEN_EXPIRES_IN: getEnv('ACCESS_TOKEN_EXPIRES_IN', '1d'),
    REFRESH_TOKEN_EXPIRES_IN: getEnv('REFRESH_TOKEN_EXPIRES_IN', '30d'),
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: getEnv(
      'BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN',
      '1d',
    ),
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: getEnv(
      'BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE',
      '1d',
    ),
    EMAIL_SENDER: {
      SMTP_USER: getEnv('EMAIL_SENDER_SMTP_USER', ''),
      SMTP_PASS: getEnv('EMAIL_SENDER_SMTP_PASS', ''),
      SMTP_HOST: getEnv('EMAIL_SENDER_SMTP_HOST', 'smtp.gmail.com'),
      SMTP_PORT: getEnv('EMAIL_SENDER_SMTP_PORT', '465'),
      SMTP_FROM: getEnv(
        'EMAIL_SENDER_SMTP_FROM',
        getEnv('EMAIL_SENDER_SMTP_USER', 'noreply@planora.com'),
      ),
    },
    GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID', ''),
    GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET', ''),
    GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL', ''),
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: getEnv('CLOUDINARY_CLOUD_NAME', ''),
      CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY', ''),
      CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET', ''),
    },
    SSLCOMMERZ: {
      SSL_STORE_ID: getEnv('SSL_STORE_ID', ''),
      SSL_STORE_PASSWORD: getEnv('SSL_STORE_PASSWORD', ''),
      SSL_IS_LIVE: getEnv('SSL_IS_LIVE', 'false'),
    },
    OPENROUTER: {
      API_KEY: getEnv('OPENROUTER_API_KEY', ''),
      API_URL: getEnv(
        'OPENROUTER_API_URL',
        'https://openrouter.ai/api/v1/chat/completions',
      ),
      MODEL: getEnv('OPENROUTER_MODEL', 'google/gemini-2.0-flash-lite-001'),
      FALLBACK_MODEL: getEnv(
        'OPENROUTER_FALLBACK_MODEL',
        'meta-llama/llama-3.1-8b-instruct:free',
      ),
    },
  };
};

export const envVars = loadEnvVariables();
