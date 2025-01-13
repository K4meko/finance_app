import {BudgetItem} from "../../types/types";

const updateBudgetItems = async (budgetItems: BudgetItem[]) => {
  const response = await fetch(`http://localhost:3000/user/update-budget`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(budgetItems),
  });
  if (!response.ok) {
    console.log(response);
    return undefined;
  }
  const data = await response;
  return data;
};
export default updateBudgetItems;
