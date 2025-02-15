import React, {useEffect} from "react";
import ExpenseComponent from "../components/ExpenseComponent";
import {getUserInfo} from "../api/queries/getUserInfo";
import {Button, Center, Container, Stack, Title} from "@mantine/core";
import {MonthlyExpense} from "../types/types";
import {useState} from "react";
import {IconDeviceFloppy} from "@tabler/icons-react";

function ExpensesContent() {
  const [userExpenses, setUserExpenses] = useState<MonthlyExpense[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUserExpenses(userInfo.monthlyExpenses || []);
        } else {
          console.error("Failed to fetch user info:", userInfo);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <>
      <Center mb={"md"}>
        <Title order={1}>Expenses</Title>
      </Center>
      <Container size='lg' p='md'>
        <Stack gap={"md"}>
          {userExpenses.map((expense: MonthlyExpense, index: number) => (
            <ExpenseComponent
              key={index}
              name={expense.type}
              amount={expense.amount}
              onUpdate={() => {}}
              onDelete={() => {}}
            />
          ))}
          <Button
            onClick={() =>
              setUserExpenses([
                ...userExpenses,
                {type: "", amount: 0, userId: 0}, // Default values for new expense
              ])
            }
          >
            Add Expense
          </Button>
          <Button
            leftSection={<IconDeviceFloppy />}
            loading={isSaving}
            onClick={() => {
              setIsSaving(true);
              // TODO: Add save logic here
              setTimeout(() => setIsSaving(false), 1000);
            }}
            color='blue'
          >
            Save Changes
          </Button>
        </Stack>
      </Container>
    </>
  );
}

export default ExpensesContent;
