/*
  A general purpose caching strategy for Blogster.
  Rationale:
    - Override the default mongoose exec function to include caching so that
    we do not need to exec a caching middleware for each route we want to cache.
    - Instead we call the custom method cache on a given route to tell the new exec to cache as needed.
    - Also expose a function to manually clear cache of a given key for update 
    routes.
    - Note this setup works for this app due to the layout of business logic/data (uses user id as hash key) and is not a general setup for every case. Every use of caching must be analyzed for proper namespacing, timing, storage logic, etc. for best performance.
*/
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const client = redis.createClient('redis://127.0.0.1:6379');
// convert lib hget method to promise based
client.hget = util.promisify(client.hget);
// pre-override reference to original mongoose exec
const exec = mongoose.Query.prototype.exec;

/** 
 * add custom method to Query which
 *  1. tells downstream ops to use cache
 *  2. attaches the top level redis hash key (user id), if present
*/
mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');

  return this;
}

/**
 * Custom implementation to embed caching
 *
 * @returns mongoose query exec result
*/
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  
/**
 * Create the key for the current query by stringifying
 *  1. the entire query
 *  2. the queried collection for proper namespacing
 */
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // early return if key in cache
  const cacheValue = await client.hget(this.hashKey, key);

  // redis data is stored as string
  // must parse & convert back to mongoose {}s before returning
  if (cacheValue) {
    console.log('sending data from cache')
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // exec regular mongoose query & cache with 10 sec expiry 
  const result = await exec.apply(this, arguments);

  client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 10);

  console.log('sending data from new query')

  return result;
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
}