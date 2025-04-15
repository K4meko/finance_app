import {MonthlyExpense} from "../../types/types";

const UpdateExpenses = async (input: {
    new_expenses: MonthlyExpense[]; monthISO: string
}) => {
  const response = await fetch(`http://localhost:3000/user/expenses`, {
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


export default UpdateExpenses;
