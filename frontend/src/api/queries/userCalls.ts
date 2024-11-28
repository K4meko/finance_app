import {useQuery} from "react-query";
interface LoginResponse {
  jwtToken: string;
}
export const fetchLogin = async (email: string, password: string) => {
  const response = await fetch("localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email, password}),
  });
  console.log("ss");
  if (!response.ok) {
    return new Error(response.statusText);
  }
  const data: LoginResponse = await response.json();
  const token = data.jwtToken;
  if (token) {
    localStorage.setItem("token", token);
  }
  console.log(token);
};
