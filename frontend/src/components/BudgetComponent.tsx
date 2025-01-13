import {Button, Card, TextInput} from "@mantine/core";

interface BudgetComponentProps {
  name: string;
  amount: number;
  onDelete: () => void;
  onUpdate: (name: string, amount: number) => void;
}

function BudgetComponent({
  name,
  amount,
  onDelete,
  onUpdate,
}: BudgetComponentProps) {
  return (
    <Card>
      <TextInput
        placeholder='Name'
        value={name}
        onChange={e => onUpdate(e.currentTarget.value, amount)}
      />
      <TextInput
        placeholder='Amount'
        value={amount}
        onChange={e => {
          const value = e.currentTarget.value;
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue) || value === "") {
            onUpdate(name, value === "" ? 0 : parsedValue);
          }
        }}
      />
      <Button onClick={onDelete}>Remove</Button>
    </Card>
  );
}

export default BudgetComponent;
