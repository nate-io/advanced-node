const dbPassword = process.env.DB_PASSWORD
const dbUri = `mongodb://advancedNodeUser:${dbPassword}@advancednode-shard-00-00-53nnr.mongodb.net:27017,advancednode-shard-00-01-53nnr.mongodb.net:27017,advancednode-shard-00-02-53nnr.mongodb.net:27017/test?ssl=true&replicaSet=advancedNode-shard-0&authSource=admin&retryWrites=true&w=majority`

module.exports = {
  googleClientID:
    '964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com',
  googleClientSecret: 'KnH-rZC23z4fr2CN4ISK4srN',
  mongoURI: dbUri,
  cookieKey: '123123123'
};
