import { GraphQLClient } from "graphql-request";

const cdnEndpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT!;

// CDN (read-only): https://ap-south-1.cdn.hygraph.com/content/PROJECT_ID/master
// API (read+write): https://api-ap-south-1.hygraph.com/v2/PROJECT_ID/master
function toApiEndpoint(cdnUrl: string): string {
  const match = cdnUrl.match(/https:\/\/([\w-]+)\.cdn\.hygraph\.com\/content\/([^/]+)\/master/);
  if (!match) return cdnUrl;
  const [, region, projectId] = match;
  return `https://api-${region}.hygraph.com/v2/${projectId}/master`;
}

// Public read-only client
export const hygraphClient = new GraphQLClient(cdnEndpoint);

// Mutation client
export const hygraphMutationClient = new GraphQLClient(toApiEndpoint(cdnEndpoint), {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
  },
});

/**
 * Robust request helper that retries on transient network errors (ECONNRESET, ETIMEDOUT)
 */
export async function hygraphSafeRequest<T>(query: string, variables?: any, client: GraphQLClient = hygraphClient): Promise<T> {
  const MAX_RETRIES = 3;
  let lastError: any;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await client.request<T>(query, variables);
    } catch (err: any) {
      lastError = err;
      const isNetworkError = 
        err.code === 'ECONNRESET' || 
        err.code === 'ETIMEDOUT' || 
        err.code === 'UND_ERR_CONNECT_TIMEOUT' ||
        err.message?.includes('fetch failed');

      if (isNetworkError && i < MAX_RETRIES - 1) {
        const delay = Math.pow(2, i) * 500; // Exponential backoff: 500ms, 1000ms, 2000ms
        console.warn(`⚠️ Hygraph connection issue (${err.code || 'fetch failed'}). Retrying in ${delay}ms... (Attempt ${i + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
