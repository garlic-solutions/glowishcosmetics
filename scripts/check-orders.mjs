import { GraphQLClient, gql } from "graphql-request";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const mutationToken = process.env.HYGRAPH_MUTATION_TOKEN;

function toApiEndpoint(cdnUrl) {
  const match = cdnUrl.match(/https:\/\/([\w-]+)\.cdn\.hygraph\.com\/content\/([^/]+)\/master/);
  if (!match) return cdnUrl;
  const [, region, projectId] = match;
  return `https://api-${region}.hygraph.com/v2/${projectId}/master`;
}

const client = new GraphQLClient(toApiEndpoint(endpoint), {
  headers: {
    Authorization: `Bearer ${mutationToken}`,
  },
});

const query = gql`
  query {
    orders(stage: DRAFT, where: { orderNumber_not: null }, orderBy: orderNumber_DESC, first: 1) {
      id
      customerName
      orderNumber
    }
  }
`;

async function main() {
  try {
    const data = await client.request(query);
    console.log("Latest Orders (DRAFT):", JSON.stringify(data.orders, null, 2));
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}

main();
