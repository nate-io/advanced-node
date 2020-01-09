const mongoose = require('mongoose');
const User = mongoose.model('User');

/** 
 * Create a new User on each test run in order to grab the
 * user id to spoof session data.
*/
module.exports = () => {
  return new User({}).save();
};