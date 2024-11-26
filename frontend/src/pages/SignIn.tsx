import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import {useForm} from "@mantine/form";
import {upperFirst, useToggle} from "@mantine/hooks";
import {Header} from "../components/Header";
import logo from "../assets/Budgetly.svg";
import {fetchLogin} from "../api/queries/userCalls";
export function SignIn(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: val =>
        val.length <= 3
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <Flex
      direction='column'
      align='center'
      justify='flex-start'
      style={{width: "100vw", height: "100vh"}}
    >
      <Header />
      <Space h={250} />
      <Paper radius='md' p='xl' withBorder {...props}>
        <Center>
          <Text size='lg' fw={600} mb={20} style={{alignSelf: "center"}}>
            Welcome to Budgetly
          </Text>
        </Center>
        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === "register" && (
              <TextInput
                label='Name'
                placeholder='Your name'
                value={form.values.name}
                onChange={event =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius='md'
              />
            )}

            <TextInput
              required
              label='Email'
              placeholder='hello@mantine.dev'
              value={form.values.email}
              onChange={event =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius='md'
            />

            <PasswordInput
              required
              label='Password'
              placeholder='Your password'
              value={form.values.password}
              onChange={event =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius='md'
            />

            {type === "register" && (
              <Checkbox
                label='I accept terms and conditions'
                checked={form.values.terms}
                onChange={event =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group justify='space-between' mt='xl'>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              onClick={() => toggle()}
              size='xs'
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type='submit' radius='xl' onSubmit={() => fetchLogin}>
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Flex>
  );
}
