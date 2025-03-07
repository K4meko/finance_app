import {useEffect, useMemo} from "react";
import ExpenseComponent from "../components/ExpenseComponent";
import {getUserInfo} from "../api/queries/getUserInfo";
import {Button, Center, Combobox, Container, Select, Stack, Title} from "@mantine/core";
import {MonthlyExpense} from "../types/types";
import {useState} from "react";
import {IconDeviceFloppy} from "@tabler/icons-react";
import moment from "moment";
import UpdateExpenses from "../api/queries/updateExpenses.ts";

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


    const months = Array.from({ length: 12 }, (_, i) =>
        moment().subtract(i, 'months').startOf('month')
    );

    const monthByFormat = months.map(m => {return {formatted: m.format("MM. YYYY"), iso: m.toISOString()}});

    const monthValues = useMemo(() => {
        return months.map((month) => (month.format("MM. YYYY")));
    }, []);

    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  return (
    <>
      <Center mb={"md"}>
        <Title order={1}>Expenses</Title>
      </Center>
        <Select label="Select a month:" data={monthValues} onChange={e => setSelectedMonth(e)}>
        </Select>
        {selectedMonth && (<Container size='lg' p='md'>
            <Stack gap={"md"}>
                {userExpenses.filter(e => e.month.timestamp === monthByFormat.find(m => m.formatted === selectedMonth)?.iso).map((expense: MonthlyExpense, index: number) => (
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
                            {type: "", amount: 0, userId: 0, month: {timestamp: monthByFormat.find(m => m.formatted === selectedMonth)?.iso || ""}}, // Default values for new expense
                        ])
                    }
                >
                    Add Expense
                </Button>
                <Button
                    leftSection={<IconDeviceFloppy />}
                    loading={isSaving}
                    onClick={async () => {
                        // setIsSaving(true);
                        await UpdateExpenses({new_expenses: userExpenses, monthISO: monthByFormat.find(m => m.formatted === selectedMonth)?.iso || ""});
                        console.log(userExpenses)
                    }}
                    color='blue'
                >
                    Save Changes
                </Button>
            </Stack>
        </Container>)}
    </>
  );
}

export default ExpensesContent;
