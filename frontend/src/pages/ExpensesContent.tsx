import {useEffect} from "react";
import ExpenseComponent from "../components/ExpenseComponent";
import {getUserInfo} from "../api/queries/getUserInfo";
import {Button, Center, Container, Stack, Title} from "@mantine/core";
import {MonthlyExpense} from "../types/types";
import {useState} from "react";
import {IconDeviceFloppy} from "@tabler/icons-react";
import UpdateExpenses from "../api/queries/updateExpenses.ts";

function ExpensesContent() {
  const [userExpenses, setUserExpenses] = useState<MonthlyExpense[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo) {
          if (userExpenses.length === 0) {
            setUserExpenses(userInfo.monthlyExpenses || []);
          }
        } else {
          console.error("Failed to fetch user info:", userInfo);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, [userExpenses.length]);

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
              onUpdate={(newText, newAmount) => {
                expense.type = newText;
                expense.amount = newAmount;
                console.log("Updated expense:", expense);
                setUserExpenses([...userExpenses]);
              }}
              onDelete={() => {
                const newUE = userExpenses.filter((_, i) => i !== index);
                setUserExpenses(newUE);
              }}
            />
          ))}
          <Button
            onClick={() =>
              setUserExpenses([
                ...userExpenses,
                {
                  type: "", 
                  amount: 0, 
                  userId: 0, 
                  month: {
                    userId: 0,
                    year: new Date().getFullYear(),
                    timestamp: new Date().toISOString(),
                    paycheck: 0,
                    createdAt: new Date().toISOString(),
                    budgetId: 0,
                    budget: []
                  }
                },
              ])
            }
          >
            Add Expense
          </Button>
          <Button
            leftSection={<IconDeviceFloppy />}
            loading={isSaving}
            onClick={async () => {
              setIsSaving(true);
              try {
                // Clean up the expenses before saving
                const cleanedExpenses = userExpenses.map(expense => ({
                  type: expense.type,
                  amount: expense.amount,
                  userId: expense.userId,
                  month: {
                    userId: expense.userId,
                    year: new Date().getFullYear(),
                    timestamp: new Date().toISOString(),
                    paycheck: 0,
                    createdAt: new Date().toISOString(),
                    budgetId: 0,
                    budget: []
                  }
                }));
                
                await UpdateExpenses({
                  new_expenses: cleanedExpenses,
                  monthISO: new Date().toISOString()
                });
                
                // Refresh the expenses after saving
                const userInfo = await getUserInfo();
                if (userInfo) {
                  setUserExpenses(userInfo.monthlyExpenses || []);
                }
                console.log("Expenses saved successfully");
              } catch (error) {
                console.error("Error saving expenses:", error);
              } finally {
                setIsSaving(false);
              }
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
