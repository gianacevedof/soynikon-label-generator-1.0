// Decodes the JWT payload stored in localStorage. This does NOT verify
// the token's signature — it just reads the claims client-side so the UI
// can show a username/role. Any real authorization check still happens
// on the backend.
const getTokenPayload = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return JSON.parse(atob(token.split(".")[1]));
};

export const getRole = () => getTokenPayload()?.role ?? null;
export const getUsername = () => getTokenPayload()?.username ?? null;
