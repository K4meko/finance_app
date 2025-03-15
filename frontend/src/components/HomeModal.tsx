import {Button, Group, Modal, NumberInput, Select, Stack} from "@mantine/core";
import {useState} from "react";

interface HomeModalProps {
  opened: boolean;
  onClose: () => void;
}

export function HomeModal({opened, onClose}: HomeModalProps) {
  const [entryType, setEntryType] = useState("");
  const [entryAmount, setEntryAmount] = useState<number | "">(0);

  const handleAddEntry = () => {
    console.log({entryType, entryAmount});
    onClose();
    setEntryType("");
    setEntryAmount(0);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddEntry}>Save Entry</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
