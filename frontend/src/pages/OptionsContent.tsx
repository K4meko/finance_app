import {useState} from "react";
import {
  Container,
  Flex,
  Group,
  Input,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {Calendar} from "@mantine/dates";

function OptionsContent() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const floating = value.trim().length !== 0 || focused || undefined;
  return (
    <Flex direction='column' gap={"sm"} align='center'>
      <Flex direction='column' align='center' gap={"md"} w={"50%"}>
        <Title order={4}>Salary</Title>
        <Input w={"100%"} radius='md' placeholder='Enter your monthly salary' />
        <Calendar size='xl' />
      </Flex>
    </Flex>
  );
}

export default OptionsContent;
