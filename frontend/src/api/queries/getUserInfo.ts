import {User} from "../../types/types";
export const getUserInfo = async () => {
  const response = await fetch(`http://localhost:3000/user/get-user-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    console.log(response);
    return undefined;
  }
  const data: User = await response.json();
  return data;
};
