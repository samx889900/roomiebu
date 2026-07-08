import { fetchGraph } from "./service";

/**
 * Fetches the user's profile photo from Microsoft Graph.
 * Returns the photo as a base64 Data URI or null if not available.
 */
export async function getGraphPhoto(accessToken: string): Promise<string | null> {
  try {
    const res = await fetchGraph("/me/photo/$value", accessToken);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    // Assuming JPEG. Graph usually returns JPEG.
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Failed to fetch graph photo:", error);
    return null;
  }
}
