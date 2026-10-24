const API_URL = "http://127.0.0.1:8000";

async function fetchData(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export const fetchMockUsers = (role) =>
  fetchData(
    `/api/mock/users${role ? `?role=${encodeURIComponent(role)}` : ""}`
  );

export const fetchMockLands = (engineerId) =>
  fetchData(
    `/api/mock/lands${
      engineerId != null ? `?engineer_id=${engineerId}` : ""
    }`
  );

export const fetchMockPlants = (gardenerId) =>
  fetchData(
    `/api/mock/plants${
      gardenerId != null ? `?gardener_id=${gardenerId}` : ""
    }`
  );