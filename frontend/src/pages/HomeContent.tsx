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
import {Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData} from "chart.js";
import { Chart } from "react-chartjs-2";
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

  const getChartData = () => {
    if (!userInfo || !userInfo.monthlyExpenses || !salary) {
      const emptyData: ChartData<"pie", number[], string> = {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
        }]
      };
      return {
        salaryData: emptyData,
        expensesData: emptyData,
        budgetData: emptyData
      };
    }

    // Calculate total expenses
    const totalExpenses = userInfo.monthlyExpenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0);

    // Calculate total budget items
    const totalBudget = budgetItems.reduce((acc, item) => {
      return acc + item.amount;
    }, 0);

    // Calculate remaining amount
    const remaining = Math.max(0, Number(salary) - totalExpenses);

    // Colors for the charts
    const colors = [
      ["rgba(255, 99, 132, 0.7)", "rgba(255, 99, 132, 1)"],   // Red
      ["rgba(54, 162, 235, 0.7)", "rgba(54, 162, 235, 1)"],   // Blue
      ["rgba(75, 192, 192, 0.7)", "rgba(75, 192, 192, 1)"],   // Teal
      ["rgba(255, 206, 86, 0.7)", "rgba(255, 206, 86, 1)"],   // Yellow
      ["rgba(153, 102, 255, 0.7)", "rgba(153, 102, 255, 1)"], // Purple
      ["rgba(255, 159, 64, 0.7)", "rgba(255, 159, 64, 1)"],   // Orange
    ];

    // Salary breakdown data
    const salaryData = {
      labels: ['Total Expenses', 'Budgeted Amount', 'Remaining'],
      datasets: [{
        data: [totalExpenses, totalBudget, remaining],
        backgroundColor: colors.slice(0, 3).map(color => color[0]),
        borderColor: colors.slice(0, 3).map(color => color[1]),
        borderWidth: 1,
      }],
    };

    // Expenses breakdown data
    const expensesByType = userInfo.monthlyExpenses.reduce((acc, expense) => {
      if (!acc[expense.type]) {
        acc[expense.type] = 0;
      }
      acc[expense.type] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const expensesData = {
      labels: Object.keys(expensesByType),
      datasets: [{
        data: Object.values(expensesByType),
        backgroundColor: Object.keys(expensesByType).map((_, i) => colors[i % colors.length][0]),
        borderColor: Object.keys(expensesByType).map((_, i) => colors[i % colors.length][1]),
        borderWidth: 1,
      }],
    };

    // Budget breakdown data
    const budgetData = {
      labels: budgetItems.map(item => item.type),
      datasets: [{
        data: budgetItems.map(item => item.amount),
        backgroundColor: budgetItems.map((_, i) => colors[i % colors.length][0]),
        borderColor: budgetItems.map((_, i) => colors[i % colors.length][1]),
        borderWidth: 1,
      }],
    };

    return { salaryData, expensesData, budgetData };
  };

  const chartData = getChartData();

  const getChartOptions = (title: string, total: number) => ({
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  });

  const salaryChartOptions = getChartOptions("Monthly Salary Breakdown", Number(salary) || 0);
  const expensesChartOptions = getChartOptions("Monthly Expenses Breakdown", 
    userInfo?.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0) || 0);
  const budgetChartOptions = getChartOptions("Monthly Budget Breakdown",
    budgetItems.reduce((acc, item) => acc + item.amount, 0) || 0);

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
            <Button onClick={handleSalaryUpdate} mb="md">Update Salary</Button>
            
            {/* Calculate and display remaining money */}
            {userInfo && (
              <Box>
                <Text size="lg" fw={500} mb="md">Financial Summary:</Text>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text>Total Expenses:</Text>
                    <Text fw={500}>${userInfo.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2)}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Available for Budget:</Text>
                    <Text fw={500}>${Math.max(0, Number(salary) - userInfo.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0)).toFixed(2)}</Text>
                  </Group>
                  
                  <Text fw={700} mt="md">Budget Items:</Text>
                  {budgetItems.map((item, index) => {
                    const availableAmount = Math.max(0, Number(salary) - userInfo.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0));
                    const budgetAmount = (item.amount / 100) * availableAmount;
                    return (
                      <Group key={index} justify="space-between" ml="md">
                        <Text>{item.type}:</Text>
                        <Group gap="xs">
                          <Text fw={500}>${budgetAmount.toFixed(2)}</Text>
                          <Text c="dimmed">({item.amount}% of available)</Text>
                        </Group>
                      </Group>
                    );
                  })}
                  
                  <Group justify="space-between" mt="md">
                    <Text fw={700}>Total Budgeted:</Text>
                    <Text fw={700}>${budgetItems.reduce((acc, item) => {
                      const availableAmount = Math.max(0, Number(salary) - userInfo.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0));
                      return acc + ((item.amount / 100) * availableAmount);
                    }, 0).toFixed(2)}</Text>
                  </Group>
                  
                  <Group justify="space-between" mt="xl">
                    <Text size="xl" fw={700} c="blue">Final Remaining:</Text>
                    <Text size="xl" fw={700} c="blue">${Math.max(0, Number(salary) - userInfo.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0) - budgetItems.reduce((acc, item) => {
                      const availableAmount = Math.max(0, Number(salary) - userInfo.monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0));
                      return acc + ((item.amount / 100) * availableAmount);
                    }, 0)).toFixed(2)}</Text>
                  </Group>
                </Stack>
              </Box>
            )}
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

        <Paper p="md" radius="md" withBorder>
          <Title order={2} mb="md">Financial Overview</Title>
          {userInfo ? (
            <Flex direction={{ base: 'column', md: 'row' }} gap="xl" align="stretch" justify="center">
              <Box w={{ base: '100%', md: '33%' }} h={400}>
                <Paper p="xs" h="100%" style={{ position: 'relative' }}>
                  <Chart type="pie" data={chartData.salaryData} options={{
                    ...salaryChartOptions,
                    maintainAspectRatio: false,
                  }} />
                </Paper>
              </Box>
              <Box w={{ base: '100%', md: '33%' }} h={400}>
                <Paper p="xs" h="100%" style={{ position: 'relative' }}>
                  {userInfo.monthlyExpenses.length > 0 ? (
                    <Chart type="pie" data={chartData.expensesData} options={{
                      ...expensesChartOptions,
                      maintainAspectRatio: false,
                    }} />
                  ) : (
                    <Flex align="center" justify="center" h="100%">
                      <Text c="dimmed" ta="center">No expenses recorded yet</Text>
                    </Flex>
                  )}
                </Paper>
              </Box>
              <Box w={{ base: '100%', md: '33%' }} h={400}>
                <Paper p="xs" h="100%" style={{ position: 'relative' }}>
                  {budgetItems.length > 0 ? (
                    <Chart type="pie" data={chartData.budgetData} options={{
                      ...budgetChartOptions,
                      maintainAspectRatio: false,
                    }} />
                  ) : (
                    <Flex align="center" justify="center" h="100%">
                      <Text c="dimmed" ta="center">No budget items set</Text>
                    </Flex>
                  )}
                </Paper>
              </Box>
            </Flex>
          ) : (
            <Text c="dimmed" ta="center">Loading...</Text>
          )}
        </Paper>
      </Paper>
    </Container>
  );
}

export default HomeContent;
