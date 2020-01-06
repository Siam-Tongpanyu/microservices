const path = require('path');

require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env')
});

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "GCx$Bwfh^M6ZusvGv$Bwj5S!K7#",
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES || 3600,
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/users"
  },
};