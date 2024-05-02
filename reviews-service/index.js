// File: reviews-service/index.js
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    productId: ID!
    content: String
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
    reviews: [Review]
  }

  type Query {
    reviews(productId: ID!): [Review]
  }
`;

const reviews = [
  { id: "1", productId: "1", content: "Great laptop, very fast." },
  { id: "2", productId: "2", content: "Amazing camera quality." },
];

const resolvers = {
  Query: {
    reviews: (_, { productId }) =>
      reviews.filter((review) => review.productId === productId),
  },
  Review: {
    __resolveReference(object) {
      return reviews.find((review) => review.id === object.id);
    },
  },
  Product: {
    reviews(product) {
      return reviews.filter((review) => review.productId === product.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Reviews service ready at ${url}`);
});
