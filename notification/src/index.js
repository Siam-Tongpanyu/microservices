const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models/models');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { port, env, jwtSecret, awsNotiQueUrl } = require('./config/vars');
const schema = require('./createSchema');
const mongoose = require('./config/mongoose');
const jwt = require('express-jwt');
const { manageMessageQue } = require('./utils/receivequeue');
const aws = require('./config/awsconfig');
const consumer = require('sqs-consumer');


const app = express();
const cors = require('cors');

app.use(`/api`, bodyParser.json(), cors(), jwt({
  secret: jwtSecret,
  credentialsRequired: false,
}), graphqlExpress(req => ({
  schema,
  context: {
   user: req.user ? req.user : Promise.resolve(null)
  }
})));

if (env === "development") {
  app.use('/graphiql', graphiqlExpress({ 
    endpointURL: `/api` 
  }));  
}

const queapp = consumer.create({
  queueUrl: awsNotiQueUrl,
  handleMessage: async (message, done) => {
   if(message){
    await manageMessageQue(message.Body);    
    done();   
   }
  },
  waitTimeSeconds: 3,
  sqs: new aws.SQS()
});
queapp.on('error', (err) => {
  console.log(err.message);
});
queapp.start();

app.listen(port, () => {
  console.log(`server started on port ${port} environment ${env}`);
});