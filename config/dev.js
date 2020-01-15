require('dotenv').config();
const dbPassword = process.env.DB_PASSWORD


module.exports = {
  googleClientID:
    '964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com',
  googleClientSecret: 'KnH-rZC23z4fr2CN4ISK4srN',
  mongoURI: `mongodb://advancedNodeUser:${dbPassword}@advancednode-shard-00-00-53nnr.mongodb.net:27017,advancednode-shard-00-01-53nnr.mongodb.net:27017,advancednode-shard-00-02-53nnr.mongodb.net:27017/test?ssl=true&replicaSet=advancedNode-shard-0&authSource=admin&retryWrites=true&w=majority`,
  cookieKey: '123123123',
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_PASS
};
