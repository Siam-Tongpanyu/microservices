const aws = require('aws-sdk');
const { awsAccessKey, awsSecretKey, awsRegion, awsNotiQueUrl } = require('./vars');
aws.config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
  region: awsRegion
});

module.exports = aws;
