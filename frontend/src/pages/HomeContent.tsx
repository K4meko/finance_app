import {useEffect, useState} from "react";
import {
  Button,
  Modal,
  Paper,
  Container,
  Box,
  Text,
  Flex,
  Title,
  NumberInput,
  Group,
  Select,
  Stack,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Pie} from "react-chartjs-2";
import {getUserInfo} from "../api/queries/getUserInfo";
import {Month} from "../types/types";

ChartJS.register(ArcElement, Tooltip, Legend);

function HomeContent() {
  const [months, setMonths] = useState<Month[]>([]);
  const [opened, {open, close}] = useDisclosure(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setMonths(userInfo.months || []);
        } else {
          console.error("Failed to fetch user info:", userInfo);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserInfo();
  }, []);

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
      legend: {position: "right" as const},
      title: {display: true, text: "Monthly Expense Breakdown"},
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

  const [entryType, setEntryType] = useState<string>("");
  const [entryAmount, setEntryAmount] = useState<number | "">("");

  const handleAddEntry = (): void => {
    close();
  };
  return (
    <Container size='lg' py='xl' w={{base: "100%", md: "80%"}}>
      <Paper shadow='sm' p='md' mb='xl' w='100%'>
        <Flex direction='row' justify='space-between' p='md' mb='xl'>
          <Title order={2}>Home</Title>
          <Button
            size='lg'
            color='blue'
            leftSection={<span>+</span>}
            onClick={() => {
              console.log("Add New Entry button clicked");
              open();
            }}
          >
            Add New Entry
          </Button>
        </Flex>
        {months.length !== 0 ? (
          <Box h={400} style={{display: "flex", justifyContent: "center"}}>
            <div style={{maxWidth: "600px", width: "100%"}}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </Box>
        ) : (
          <Text>No data available</Text>
        )}
      </Paper>

      <Modal
        onClose={() => {
          close();
        }}
        opened={opened}
        title='Add New Financial Entry'
        size='md'
        centered
      >
        <Stack>
          <Select
            label='Category'
            placeholder='Select category'
            value={entryType}
            onChange={val => setEntryType(val || "")}
            data={[
              {value: "housing", label: "Housing"},
              {value: "food", label: "Food"},
              {value: "transportation", label: "Transportation"},
              {value: "entertainment", label: "Entertainment"},
              {value: "utilities", label: "Utilities"},
              {value: "savings", label: "Savings"},
              {value: "other", label: "Other"},
            ]}
            required
          />

          <NumberInput
            label='Amount'
            value={entryAmount}
            onChange={val => setEntryAmount(val as number | "")}
            min={0}
            required
            placeholder='Enter amount'
            leftSection='$'
          />

          <Group justify='flex-end' mt='md'>
            <Button variant='outline' onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>Save Entry</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default HomeContent;
