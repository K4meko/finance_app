import {BudgetItem} from "../../types/types";

const UpdateSettings = async (input: {
  newItems?: BudgetItem[];
  expectedDatePaycheck?: Date | null;
  salaryAmount?: number;
}) => {
  const response = await fetch(`http://localhost:3000/user/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    console.log(response);
    return undefined;
  }
  const data = await response;
  return data;
};

export default UpdateSettings;
