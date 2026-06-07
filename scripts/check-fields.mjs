import { GraphQLClient, gql } from "graphql-request";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const mutationToken = process.env.HYGRAPH_MUTATION_TOKEN;

const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${mutationToken}`,
  },
});

const query = gql`
  query {
    __type(name: "Order") {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

async function main() {
  try {
    const data = await client.request(query);
    console.log("Order Fields:", JSON.stringify(data.__type.fields, null, 2));
  } catch (err) {
    console.error("Error fetching schema:", err);
  }
}

main();
