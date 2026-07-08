import { fetchGraph } from "./service";

export interface GraphProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
}

export async function getGraphProfile(accessToken: string): Promise<GraphProfile> {
  const res = await fetchGraph("/me", accessToken);
  const data = await res.json();
  return data as GraphProfile;
}
