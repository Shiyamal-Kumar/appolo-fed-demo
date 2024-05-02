const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    name: String
  }

  type Query {
    account(id: ID!): Account
  }
`;

const accounts = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

const resolvers = {
  Query: {
    account: (_, { id }) => accounts.find((account) => account.id === id),
  },
  Account: {
    __resolveReference(object) {
      return accounts.find((account) => account.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Accounts service ready at ${url}`);
});
