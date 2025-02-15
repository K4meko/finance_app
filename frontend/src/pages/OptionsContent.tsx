import {useEffect, useState} from "react";
import {
  Center,
  Container,
  Flex,
  Input,
  Text,
  TextInput,
  Title,
  Card,
  Button,
} from "@mantine/core";
import {DatePicker} from "@mantine/dates";
import {getUserInfo} from "../api/queries/getUserInfo";
import {User, BudgetItem} from "../types/types";
import BudgetComponent from "../components/BudgetComponent";

import UpdateSettings from "../api/queries/updateBudget";

interface budgetinItem {
  name: string;
  amount: number;
}
function OptionsContent() {
  const [focused, setFocused] = useState(false);
  const handleUpdateBudgetItem = (
    index: number,
    name: string,
    amount: number
  ) => {
    const updatedItems = budgetingItems.map((item, i) =>
      i === index ? {...item, type: name, amount} : item
    );
    setBudgetingItems(updatedItems);
  };
  const [budgetingItems, setBudgetingItems] = useState<BudgetItem[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [value, setValue] = useState<Date | null>(null);
  const [salaryDate, setSalaryDate] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo) {
          setBudgetingItems(userInfo.defaultBudget || []);
          if (userInfo.expectedDatePaycheck) {
            setValue(new Date(userInfo.expectedDatePaycheck));
          }
        } else {
          console.error("Failed to fetch user info:", userInfo);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <>
      <Center mb={"lg"}>
        <Title order={1}>Options</Title>
      </Center>

      <Container size='lg' p='md'>
        <Flex
          direction='row'
          gap='md'
          align='start'
          justify='space-between'
          w='100%'
        >
          <Card shadow='sm' p='lg' radius='md' withBorder w='48%'>
            <Title order={2} mb='md'>
              Salary
            </Title>
            <Input
              w='100%'
              radius='md'
              placeholder='Enter your monthly salary'
            />
            <Text w='100%' mt='md'>
              When is your salary?
            </Text>
            <DatePicker
              w='100%'
              size='xl'
              value={value}
              onChange={setValue}
              mt='md'
            />
            <Button
              m={"md"}
              onClick={() => {
                UpdateSettings({expectedDatePaycheck: value});
              }}
            >
              Submit
            </Button>
          </Card>
          <Card shadow='sm' p='lg' radius='md' withBorder w='48%'>
            <Title order={2} mb='md'>
              Budgeting
            </Title>

            {budgetingItems.length === 0 && (
              <Center mt='md'>
                <Text>No budgeting items found</Text>
              </Center>
            )}
            {budgetingItems.map((item, index) => (
              <BudgetComponent
                key={index}
                name={item.type}
                amount={item.amount}
                onDelete={() => {
                  setBudgetingItems(
                    budgetingItems.filter((_, i) => i !== index)
                  );
                }}
                onUpdate={(name, amount) =>
                  handleUpdateBudgetItem(index, name, amount)
                }
              />
            ))}
            <Button
              m={"xl"}
              color={"violet"}
              onClick={() =>
                setBudgetingItems([...budgetingItems, {amount: 0, type: ""}])
              }
              variant={"light"}
              style={{
                borderColor: "transparent",
                "&:hover": {
                  borderColor: "transparent",
                },
              }}
            >
              Add new
            </Button>
            <Button
              onClick={() => {
                console.log(budgetingItems);
                UpdateSettings({newItems: budgetingItems});
              }}
            >
              Submit
            </Button>
          </Card>
        </Flex>
      </Container>
    </>
  );
}

export default OptionsContent;
