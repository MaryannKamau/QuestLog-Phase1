const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const TOKEN_KEY = "questlog_token";
const USER_KEY = "questlog_user";

async function authRequest(path, payload) {
  const response = await fetch(`${API_BASE_URL}/auth${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Authentication request failed.");
  }

  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }

  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export function registerUser({ username, email, password }) {
  return authRequest("/register", { username, email, password });
}

export function loginUser({ email, password }) {
  return authRequest("/login", { email, password });
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}