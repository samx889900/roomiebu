/**
 * Base service for interacting with Microsoft Graph API.
 */

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

export async function fetchGraph(endpoint: string, accessToken: string) {
  const res = await fetch(`${GRAPH_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Graph API error: ${res.statusText}`);
  }

  return res;
}
