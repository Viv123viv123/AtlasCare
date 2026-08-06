export function getClerkToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("clerk_token") ||
    localStorage.getItem("authToken") ||
    null
  );
}

export function buildAdminFetchOptions(options = {}) {
  const token = getClerkToken();
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return { ...options, headers };
}

export async function adminFetch(url, options = {}) {
  return fetch(url, buildAdminFetchOptions(options));
}
