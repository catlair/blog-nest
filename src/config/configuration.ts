// 这里的名字如果和环境变量的名字一致，则只会读取环境变量的值，所以改成了小写
const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
});

type EnvType = {
  JWT_SECRET: string;
  NODE_ENV: string;
  MONGODB_URI: string;
};

export type Configuration = ReturnType<typeof configuration> & EnvType;

export default configuration;

export { configuration };
