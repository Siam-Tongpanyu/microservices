const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models/models');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { port, env, jwtSecret } = require('./config/vars');
const schema = require('./createSchema');
const jwt = require('express-jwt');

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

app.listen(port, () => {
  console.log(`server started on port ${port} environment ${env}`);
});