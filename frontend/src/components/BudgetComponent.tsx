import {Button, Card, Flex, TextInput} from "@mantine/core";

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
    <Card shadow='sm' p='md' radius='md' withBorder>
      <Flex direction='column' gap='md'>
        <TextInput
          label='Name'
          placeholder='Enter category name'
          value={name}
          onChange={e => onUpdate(e.currentTarget.value, amount)}
          radius='md'
          size='md'
        />
        <TextInput
          label='Amount'
          placeholder='Enter amount'
          value={amount}
          onChange={e => {
            const value = e.currentTarget.value;
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) || value === "") {
              onUpdate(name, value === "" ? 0 : parsedValue);
            }
          }}
          radius='md'
          size='md'
        />
        <Button
          color='red'
          variant='light'
          onClick={onDelete}
          radius='md'
          mt='sm'
          style={{
            borderColor: "transparent",
            "&:hover": {
              borderColor: "red",
            },
          }}
        >
          Remove
        </Button>
      </Flex>
    </Card>
  );
}

export default BudgetComponent;
