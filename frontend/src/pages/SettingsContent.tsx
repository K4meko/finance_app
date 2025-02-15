import {
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Input,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {getUserInfo} from "../api/queries/getUserInfo";
import {fetchUpdateInfo} from "../api/queries/updateInfo";
import {IconLock, IconTrash} from "@tabler/icons-react";
export default function SettingsContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo) {
          console.log(userInfo.password);
          setEmail(userInfo.email);
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
      <Center>
        <Title order={1}>Settings</Title>
      </Center>

      <Container size='md'>
        <Card shadow='sm' p='xl' radius='md' withBorder mt={40}>
          <Stack gap='lg'>
            <Flex gap='md'>
              <TextInput
                label='First Name'
                placeholder='Enter first name'
                radius='md'
                style={{flex: 1}}
                onChange={e => setFirstName(e.currentTarget.value)}
              />
              <TextInput
                label='Last Name'
                placeholder='Enter last name'
                radius='md'
                style={{flex: 1}}
                onChange={e => setLastName(e.currentTarget.value)}
              />
            </Flex>
            <TextInput
              label='Email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
              radius='md'
            />

            <Divider
              m='lg'
              label='Danger Zone'
              labelPosition='center'
              color='red'
            />

            <Stack gap='md'>
              <TextInput
                label='Old Password'
                type='password'
                placeholder='Enter old password'
                value={oldPassword}
                leftSection={<IconLock size='1.2rem' />}
                onChange={e => setOldPassword(e.currentTarget.value)}
                radius='md'
              />
              <TextInput
                label='New Password'
                type='password'
                placeholder='Enter new password'
                value={password}
                leftSection={<IconLock size='1.2rem' />}
                onChange={e => setPassword(e.currentTarget.value)}
                radius='md'
              />
              <TextInput
                label='Confirm Password'
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                leftSection={<IconLock size='1.2rem' />}
                onChange={e => {
                  setConfirmPassword(e.currentTarget.value);
                  setPasswordMatch(e.currentTarget.value === password);
                }}
                radius='md'
                error={!passwordMatch && "Passwords do not match"}
              />
              <Button
                color='red'
                variant='outline'
                leftSection={<IconTrash size='1.2rem' />}
                fullWidth
                style={theme => ({
                  borderColor: theme.colors.red[5],
                  color: theme.colors.red[5],
                  "&:hover": {
                    borderColor: theme.colors.red[6],
                    backgroundColor: theme.colors.red[1],
                    color: theme.colors.red[6],
                  },
                })}
                onClick={() => console.log("Delete account clicked")}
              >
                Delete Account
              </Button>
            </Stack>
            <Button
              onClick={() => {
                if (password !== confirmPassword) {
                  setPasswordMatch(false);
                  return;
                }
                fetchUpdateInfo({
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  password: password,
                  oldPassword: oldPassword,
                });
              }}
              color='blue'
              radius='md'
              mt='md'
            >
              Save Changes
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
