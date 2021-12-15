// 这里的名字如果和环境变量的名字一致，则只会读取环境变量的值，所以改成了小写
const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  cacheTTl: parseInt(process.env.CACHE_TTL, 10) || 300,
});

type EnvType = {
  /** JWT 密匙 */
  JWT_SECRET: string;
  /** 运行环境 */
  NODE_ENV: string;
  /** 数据库地址 */
  MONGODB_URI: string;
  /** 盐 */
  SALT: string;
  /** 不使用 redis 进行缓存 */
  REDIS_DISABLE: string;
  // 下面是非直接使用的环境变量
  PORT: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  CACHE_TTL: string;
};

export type Configuration = ReturnType<typeof configuration> & EnvType;

export default configuration;

export { configuration };
