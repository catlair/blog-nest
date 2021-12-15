declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        JWT_SECRET: string;
        MONGODB_URI: string;
        SALT: string;
        EMAIL_HOST: string;
        EMAIL_PORT?: string;
        EMAIL_USER: string;
        EMAIL_PASS: string;
        REDIS_HOST?: string;
        REDIS_PORT?: string;
        REDIS_PASSWORD?: string;
        REDIS_DISABLE?: string;
        CACHE_TTL?: string;
      }
    }
  }
}
