const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

mongoose.Promise = Promise;

if (env === 'development') {
  mongoose.set('debug', true);
}

const MONGO_URI = mongo.uri;
if (!MONGO_URI) {
  throw new Error('You must provide a MongoDB URI');
}

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoDB instance.'))
  .on('error', error => console.log('Error connecting to MongoDB:', error));