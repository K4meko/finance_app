import React, {useState, useEffect} from "react";
import {
  Button,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Group,
  Stack,
  Title,
  Paper,
  Container,
  Box,
  Text,
  Space,
  Flex,
  Tabs,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Pie} from "react-chartjs-2";
import {getUserInfo} from "../api/queries/getUserInfo";
import {User, BudgetItem} from "../types/types";
import UpdateSettings from "../api/queries/updateBudget";
import UpdateExpenses from "../api/queries/updateExpenses";
import {FinancialEntryModal} from "../components/FinancialEntryModal";
import ExpenseComponent from "../components/ExpenseComponent";
import BudgetComponent from "../components/BudgetComponent";
import {IconPlus, IconCalendarPlus} from "@tabler/icons-react";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function HomeContent() {
  const [opened, {open, close}] = useDisclosure(false);
  const [entryType, setEntryType] = useState("");
  const [entryAmount, setEntryAmount] = useState<number | "">(0);
  const [salary, setSalary] = useState<number | "">(0);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserInfo();
        if (data) {
          setUserInfo(data);
          setSalary(data.salaryAmount || 0);
          setBudgetItems(data.defaultBudget || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  // Mock data for the pie chart
  const chartData = {
    labels: [
      "Housing",
      "Food",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Savings",
    ],
    datasets: [
      {
        data: [1200, 400, 300, 200, 250, 650],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Monthly Expense Breakdown",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const handleExpenseUpdate = async (index: number, newName: string, newAmount: number) => {
    if (!userInfo) return;
    
    const updatedExpenses = [...userInfo.monthlyExpenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      type: newName,
      amount: newAmount
    };
    
    setUserInfo({
      ...userInfo,
      monthlyExpenses: updatedExpenses
    });

    try {
      await UpdateExpenses({
        new_expenses: updatedExpenses,
        monthISO: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleExpenseDelete = async (index: number) => {
    if (!userInfo) return;

    const updatedExpenses = [...userInfo.monthlyExpenses];
    updatedExpenses.splice(index, 1);
    
    setUserInfo({
      ...userInfo,
      monthlyExpenses: updatedExpenses
    });

    try {
      await UpdateExpenses({
        new_expenses: updatedExpenses,
        monthISO: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleAddExpense = async () => {
    if (!userInfo) return;

    const newExpense = {
      type: "",
      amount: 0,
      userId: userInfo.id,
      month: {
        userId: userInfo.id,
        year: new Date().getFullYear(),
        timestamp: new Date().toISOString(),
        paycheck: 0,
        createdAt: new Date().toISOString(),
        budgetId: 0,
        budget: []
      }
    };

    const updatedExpenses = [...userInfo.monthlyExpenses, newExpense];
    
    setUserInfo({
      ...userInfo,
      monthlyExpenses: updatedExpenses
    });

    try {
      await UpdateExpenses({
        new_expenses: updatedExpenses,
        monthISO: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleSalaryUpdate = async () => {
    try {
      await UpdateSettings({
        salaryAmount: salary as number
      });
      // Refresh user info
      const data = await getUserInfo();
      if (data) {
        setUserInfo(data);
        setSalary(data.salaryAmount || 0);
      }
      close();
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  const handleAddMonth = async () => {
    if (!userInfo) return;

    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const monthISO = new Date().toISOString();

    try {
      const response = await fetch('http://localhost:3000/user/month', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          monthISO,
          name: monthName,
          salary: salary || 0,
          expenses: userInfo.monthlyExpenses.map(expense => ({
            type: expense.type,
            amount: expense.amount,
            userId: userInfo.id
          })),
          budgetItems: budgetItems.map(item => ({
            type: item.type,
            amount: item.amount
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save month');
      }

      // Refresh user info to get the updated data
      const updatedUserInfo = await getUserInfo();
      if (updatedUserInfo) {
        setUserInfo(updatedUserInfo);
      }
    } catch (error) {
      console.error('Error saving month:', error);
    }
  };

  const handleBudgetUpdate = async (index: number, newName: string, newAmount: number) => {
    const updatedItems = [...budgetItems];
    updatedItems[index] = {
      ...updatedItems[index],
      type: newName,
      amount: newAmount
    };
    
    setBudgetItems(updatedItems);

    try {
      await UpdateSettings({
        newItems: updatedItems
      });
    } catch (error) {
      console.error("Error saving budget item:", error);
    }
  };

  const handleBudgetDelete = async (index: number) => {
    const updatedItems = budgetItems.filter((_, i) => i !== index);
    setBudgetItems(updatedItems);

    try {
      await UpdateSettings({
        newItems: updatedItems
      });
    } catch (error) {
      console.error("Error deleting budget item:", error);
    }
  };

  const handleAddBudgetItem = async () => {
    const newItem = {
      type: "",
      amount: 0
    };

    const updatedItems = [...budgetItems, newItem];
    setBudgetItems(updatedItems);

    try {
      await UpdateSettings({
        newItems: updatedItems
      });
    } catch (error) {
      console.error("Error adding budget item:", error);
    }
  };

  return (
    <Container size='lg' py='xl' w={{base: "100%", md: "80%"}}>
      <Paper shadow='sm' p='md' mb='xl' w={"100%"} flex={"true"}>
        <Flex direction={"row"} justify={"space-between"} p='md' mb='xl'>
          <Title order={2} mb='md'>
            Home
          </Title>
          <Group>
            <Button
              size="sm"
              variant="light"
              onClick={handleAddMonth}
              leftSection={<IconCalendarPlus size={14} />}
            >
              Save Month
            </Button>
            <Button
              size="sm"
              variant="light"
              onClick={handleAddExpense}
              leftSection={<IconPlus size={14} />}
            >
              Add Expense
            </Button>
          </Group>
        </Flex>

        <Stack gap="xl">
          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Monthly Salary</Title>
            <NumberInput
              label="Salary Amount"
              value={salary}
              onChange={val => setSalary(val as number | "")}
              min={0}
              leftSection="$"
              w="100%"
              mb="md"
            />
            <Button onClick={handleSalaryUpdate}>Update Salary</Button>
          </Paper>

          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Monthly Expenses</Title>
            <Stack mt="md">
              {userInfo?.monthlyExpenses.map((expense, index) => (
                <ExpenseComponent
                  key={index}
                  name={expense.type}
                  amount={expense.amount}
                  onUpdate={(newName, newAmount) => handleExpenseUpdate(index, newName, newAmount)}
                  onDelete={() => handleExpenseDelete(index)}
                />
              ))}
            </Stack>
          </Paper>

          <Paper shadow="sm" p="md">
            <Title order={3} mb="md">Budget Items</Title>
            <Stack mt="md">
              {budgetItems.map((item, index) => (
                <BudgetComponent
                  key={index}
                  name={item.type}
                  amount={item.amount}
                  onUpdate={(newName, newAmount) => handleBudgetUpdate(index, newName, newAmount)}
                  onDelete={() => handleBudgetDelete(index)}
                />
              ))}
              <Button
                variant="light"
                onClick={handleAddBudgetItem}
                leftSection={<IconPlus size={14} />}
              >
                Add Budget Item
              </Button>
            </Stack>
          </Paper>
        </Stack>

        <Box h={400} style={{display: "flex", justifyContent: "center"}}>
          <div style={{maxWidth: "600px", width: "100%"}}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </Box>
      </Paper>
    </Container>
  );
}

export default HomeContent;
