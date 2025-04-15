import {jwtDecode} from "jwt-decode";
interface LoginResponse {
  access_token: string;
}
export const fetchLogin = async (email: string, password: string) => {
  const response = await fetch(`http://localhost:3000/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, password}),
  });

  if (!response.ok) {
    console.log(response);
    return response.statusText;
  }
  const data: LoginResponse = await response.json();
  const token = data.access_token;
  localStorage.setItem('token', token);
  return null;
};
