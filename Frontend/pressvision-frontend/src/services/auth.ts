export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export const login = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch("http://localhost:1337/api/auth/local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Login failed");
  }

  // Save token
  localStorage.setItem("token", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data as LoginResponse;
};
