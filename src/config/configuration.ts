export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/test',
});
