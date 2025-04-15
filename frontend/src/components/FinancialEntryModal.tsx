import {Button, Group, Modal, NumberInput, Select, Stack, Tabs} from "@mantine/core";
import {useState} from "react";

interface FinancialEntryModalProps {
  opened: boolean;
  onClose: () => void;
  onAddEntry: (type: string, amount: number) => void;
  onUpdateSalary: (amount: number) => void;
  currentSalary: number;
}

export function FinancialEntryModal({
  opened,
  onClose,
  onAddEntry,
  onUpdateSalary,
  currentSalary,
}: FinancialEntryModalProps) {
  const [entryType, setEntryType] = useState("");
  const [entryAmount, setEntryAmount] = useState<number | "">(0);
  const [salary, setSalary] = useState<number | "">(currentSalary);

  const handleAddEntry = () => {
    if (entryType && entryAmount) {
      onAddEntry(entryType, entryAmount as number);
      setEntryType("");
      setEntryAmount(0);
    }
  };

  const handleSalaryUpdate = () => {
    if (salary) {
      onUpdateSalary(salary as number);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Add New Financial Entry'
      size='md'
      centered
      withCloseButton
      styles={{
        root: {
          position: 'fixed',
          zIndex: 1000,
        },
        content: {
          position: 'relative',
          zIndex: 1001,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        },
        title: {
          fontWeight: 600,
        },
        body: {
          padding: "var(--mantine-spacing-md)",
        },
      }}
    >
      <Tabs defaultValue="expense">
        <Tabs.List>
          <Tabs.Tab value="expense">Expense</Tabs.Tab>
          <Tabs.Tab value="salary">Salary</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="expense">
          <Stack mt="md">
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
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAddEntry}>Save Expense</Button>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="salary">
          <Stack mt="md">
            <NumberInput
              label='Monthly Salary'
              value={salary}
              onChange={val => setSalary(val as number | "")}
              min={0}
              required
              placeholder='Enter monthly salary'
              leftSection='$'
            />

            <Group justify='flex-end' mt='md'>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSalaryUpdate}>Update Salary</Button>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
} 