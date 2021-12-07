// 这里的名字如果和环境变量的名字一致，则只会读取环境变量的值，所以改成了小写
const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
};

export type Configuration = ReturnType<typeof configuration> & EnvType;

export default configuration;

export { configuration };
