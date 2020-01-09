const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

/** 
 * Mimic the session built by our API by using the same internal
 * libs to build raw data for cookie.
 * 
 * This technique allows us to bypass actually logging into an
 * auth provider during testing.
*/
module.exports = user => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig };
};