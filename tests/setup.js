jest.setTimeout(30000);

/*
  MongoDB setup for tests
    - tests run against auth'd routes
    - mock new user @ test run in order to build the session/session.sig cookies
    - bypasses actual login to credential providers regardless of environment
 */
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });