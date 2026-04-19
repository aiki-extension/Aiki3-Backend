const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export async function apiFetch(path, options = {}, token) {
  const hasBody = options.body !== undefined;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) {
    return null;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { status: res.status, message: data.message || "Error" };
  }

  return data;
}
