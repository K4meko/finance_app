import React, {useState} from "react";
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
} from "@mantine/core";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Pie} from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function HomeContent() {
  const [openModal, setOpenModal] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [entryAmount, setEntryAmount] = useState<number | "">(0);

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
          "rgba(255, 99, 132, 0.7)", // red - housing
          "rgba(54, 162, 235, 0.7)", // blue - food
          "rgba(255, 206, 86, 0.7)", // yellow - transportation
          "rgba(75, 192, 192, 0.7)", // green - entertainment
          "rgba(153, 102, 255, 0.7)", // purple - utilities
          "rgba(255, 159, 64, 0.7)", // orange - savings
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

  const handleAddEntry = () => {
    // Here you would handle the submission of the new entry
    console.log({entryType, entryAmount});
    setOpenModal(false);

    // Reset form
    setEntryType("");
    setEntryAmount(0);
  };

  return (
    <Container size='lg' py='xl' w={{base: "100%", md: "80%"}}>
      <Paper shadow='sm' p='md' mb='xl' w={"100%"} flex={"true"}>
        <Flex direction={"row"} justify={"space-between"} p='md' mb='xl'>
          <Title order={2} mb='md'>
            Home
          </Title>
          <Button
            size='lg'
            onClick={() => setOpenModal(true)}
            color='blue'
            leftSection={<span>+</span>}
          >
            Add New Entry
          </Button>
        </Flex>

        <Box h={400} style={{display: "flex", justifyContent: "center"}}>
          <div style={{maxWidth: "600px", width: "100%"}}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </Box>
      </Paper>

      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title='Add New Financial Entry'
        size='md'
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
            <Button variant='outline' onClick={() => setOpenModal(false)}>
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
