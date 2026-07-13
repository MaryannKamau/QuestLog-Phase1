const DEPLOYED_BACKEND_URL = "https://questlog-backend-2.onrender.com/api";
const API_BASE_URL = `${DEPLOYED_BACKEND_URL}/auth`;
const TOKEN_KEY = "questlog_token";
const USER_KEY = "questlog_user";

// Phase 3 Registration Network Handler
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

// Phase 3 Login Network Handler with Local Storage Token Persistence
export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  // Safely preserves tokens to prevent logging users out when they hit refresh
  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

// Phase 3 Fetch Profile Context Endpoint Handler
export async function getCurrentUser(token) {
  const response = await fetch(`${DEPLOYED_BACKEND_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch user");
  }

  return data;
}

// Protected Browser Cache Helper Systems (Kept from your architecture)
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
