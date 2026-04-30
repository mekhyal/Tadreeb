export function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) return true;

  return Date.now() >= payload.exp * 1000;
}

export function clearStoredAuth() {
  localStorage.removeItem("tadreeb_user");
  localStorage.removeItem("tadreeb_token");
}
