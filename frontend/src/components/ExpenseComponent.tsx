import {TextInput, ActionIcon, Card, Flex} from "@mantine/core";
import {IconX} from "@tabler/icons-react";

interface ExpenseComponentProps {
  name: string;
  amount: number;
  onDelete: () => void;
  onUpdate: (name: string, amount: number) => void;
}

export function ExpenseComponent({
  name,
  amount,
  onDelete,
  onUpdate,
}: ExpenseComponentProps) {
  return (
    <Card shadow='sm' p='xs' radius='md' withBorder>
      <Flex align='center' gap='md'>
        <TextInput
          placeholder='Expense name'
          value={name}
          onChange={e => onUpdate(e.currentTarget.value, amount)}
          style={{flex: 2}}
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
          style={{flex: 1}}
        />
        <ActionIcon color='red' onClick={onDelete} variant='subtle'>
          <IconX onClick={onDelete} size='1.125rem' />
        </ActionIcon>
      </Flex>
    </Card>
  );
}

export default ExpenseComponent;
