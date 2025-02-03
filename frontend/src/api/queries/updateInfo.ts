export const fetchUpdateInfo = async (data: UpdateInfoInput) => {
  const response = await fetch(`http://localhost:3000/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    console.log(response);
    return response.statusText;
  }
  const res = await response.json();
  console.log(res);
};
interface UpdateInfoInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}
