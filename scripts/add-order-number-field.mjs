import { Client } from '@hygraph/management-sdk';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const cdnEndpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const mutationToken = process.env.HYGRAPH_MUTATION_TOKEN;

function toApiEndpoint(cdnUrl) {
  const match = cdnUrl.match(/https:\/\/([\w-]+)\.cdn\.hygraph\.com\/content\/([^/]+)\/master/);
  if (!match) return cdnUrl;
  const [, region, projectId] = match;
  return `https://api-${region}.hygraph.com/v2/${projectId}/master`;
}

const apiEndpoint = toApiEndpoint(cdnEndpoint);

console.log("Using API endpoint:", apiEndpoint);

const client = new Client({
  authToken: mutationToken,
  endpoint: apiEndpoint,
});

async function main() {
  console.log("Attempting to add 'orderNumber' field to 'Order' model...");
  
  try {
    client.createSimpleField({
      parentApiId: 'Order',
      apiId: 'orderNumber',
      displayName: 'Order Number',
      type: 'INT',
      isUnique: true,
    });

    const result = await client.run(false);
    console.log("✅ Field creation successful!", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("❌ Field creation failed:", err.message ?? err);
  }
}

main();
