import React, { useState, useEffect } from 'react';
import { Paper, Text, Group, Stack, Badge, Title, Button } from '@mantine/core';
import { getUserInfo } from '../api/queries/getUserInfo';
import { User, Month, MonthBudgetItem, MonthlyExpense } from '../types/types';

interface MonthDetails {
  timestamp: string;
  paycheck: number;
  budgetItems: MonthBudgetItem[];
  expenses: MonthlyExpense[];
}

export function Calendar() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [months, setMonths] = useState<MonthDetails[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsRefreshing(true);
      const data = await getUserInfo();
      if (data) {
        setUserInfo(data);
        // Sort months by timestamp in descending order (newest first)
        const sortedMonths = data.months
          .map(month => ({
            timestamp: month.timestamp,
            paycheck: month.paycheck,
            budgetItems: month.budget || [],
            expenses: data.monthlyExpenses.filter(expense => expense.month.timestamp === month.timestamp) || [],
          }))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setMonths(sortedMonths);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>Monthly Overview</Title>
        <Button 
          variant="light" 
          onClick={fetchUserData}
          loading={isRefreshing}
        >
          Refresh
        </Button>
      </Group>
      {months.map((month, index) => (
        <Paper key={index} p="md" withBorder>
          <Stack gap="md">
            <Text size="xl" fw={700}>
              {new Date(month.timestamp).toLocaleString('default', { 
                month: 'long',
                year: 'numeric'
              })}
            </Text>

            <Group justify="space-between">
              <Text>Paycheck:</Text>
              <Badge color="green" size="lg">
                ${month.paycheck.toFixed(2)}
              </Badge>
            </Group>

            <Stack gap="xs">
              <Text fw={600}>Expenses:</Text>
              {month.expenses.length > 0 ? (
                month.expenses.map((expense, index) => (
                  <Group key={index} justify="space-between">
                    <Text>{expense.type}</Text>
                    <Badge color="red" size="lg">
                      ${expense.amount.toFixed(2)}
                    </Badge>
                  </Group>
                ))
              ) : (
                <Text c="dimmed">No expense items</Text>
              )}
            </Stack>

            <Stack gap="xs">
              <Text fw={600}>Budget Items:</Text>
              {month.budgetItems.length > 0 ? (
                month.budgetItems.map((item, index) => (
                  <Group key={index} justify="space-between">
                    <Text>{item.type}</Text>
                    <Badge color="blue" size="lg">
                      ${item.amount.toFixed(2)}
                    </Badge>
                  </Group>
                ))
              ) : (
                <Text c="dimmed">No budget items</Text>
              )}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
} 