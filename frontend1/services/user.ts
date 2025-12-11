// /lib/api.ts
export const API_URL = "http://localhost:5000"; // your backend URL

export const signup = async (data: { username: string; email: string; password: string }) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data: { email: string; password: string }) => {
    debugger;
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
