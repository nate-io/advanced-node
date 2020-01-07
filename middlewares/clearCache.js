const { clearHash } = require('../services/cache');

/*
  Middleware to clear redis cache

  Uses a trick to call next first to store the value and then 
  clear the cache.
*/
module.exports = async (req, res, next) => {
  await next();

  console.log('clearing cache!')
  clearHash(req.user.id);
}