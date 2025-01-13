import {Button, Card, TextInput} from "@mantine/core";

interface BudgetComponentProps {
  name: string;
  amount: number;
  onDelete: () => void;
}

function BudgetComponent({name, amount, onDelete}: BudgetComponentProps) {
  return (
    <Card>
      <TextInput placeholder='Name' value={name} />
      <TextInput placeholder='Amount' value={amount} />
      <Button
        onClick={() => {
          onDelete();
        }}
      >
        Remove
      </Button>
    </Card>
  );
}

export default BudgetComponent;
