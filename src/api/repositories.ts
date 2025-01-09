import { API_HOST } from "./api.config";

export async function fetchRepositories(): Promise<IRepositoryRecord[]> {
  const response = await fetch(`${API_HOST}/orgs/godaddy/repos`);
  const results = await response.json();
  return results;
}

export async function fetchRepositoryDetails(
  repositoryName: string
): Promise<IRepositoryRecord> {
  const response = await fetch(`${API_HOST}/repos/godaddy/${repositoryName}`);
  const result = await response.json();

  if ("message" in result) {
    throw new Error("Not found");
  }

  return result;
}
