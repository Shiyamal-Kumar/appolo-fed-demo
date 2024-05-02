import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      reviews {
        id
        content
      }
    }
  }
`;

function Products() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Products</h2>
      {data.products.map(({ id, name, price, reviews }) => (
        <div key={id}>
          <h3>
            {name} - ${price.toFixed(2)}
          </h3>
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>{review.content}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Products;
