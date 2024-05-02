// File: products-service/index.js
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String
    price: Float
  }

  type Query {
    product(id: ID!): Product
    products: [Product]
  }
`;

const products = [
  { id: "1", name: "Laptop", price: 999.99 },
  { id: "2", name: "Smartphone", price: 699.99 },
];

const resolvers = {
  Query: {
    product: (_, { id }) => products.find((product) => product.id === id),
    products: () => products,
  },
  Product: {
    __resolveReference(object) {
      return products.find((product) => product.id === object.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Products service ready at ${url}`);
});
