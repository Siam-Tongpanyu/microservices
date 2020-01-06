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
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/notificate"
  },
  systemEmail: process.env.SYSTEM_EMAIL || "siam@mohara.co",
  awsAccessKey: process.env.AWS_ACCESS_KEY || "xxxxxxxxxxxxxxxxx",
  awsSecretKey: process.env.AWS_SECRET_KEY || "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  awsRegion: process.env.AWS_REGION || "eu-west-1",
  awsNotiQueUrl: process.env.AWS_NOTIFICATION_QUEUE || "https://sqs.eu-west-1.amazonaws.com/377333781106/Notification_Queue_Service"   
};