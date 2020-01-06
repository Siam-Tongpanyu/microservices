const { mergeTypes, mergeResolvers, fileLoader } = require("merge-graphql-schemas");
const { makeExecutableSchema } = require('graphql-tools');
const path = require("path");

const createSchema = () => {
  const typeDefs = fileLoader(path.join(__dirname, 'modules/**/*.graphql'));
  const resolvers = fileLoader(path.join(__dirname, "modules/**/resolvers.*"));

  return makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers: mergeResolvers(resolvers)
  });
};

module.exports = createSchema();