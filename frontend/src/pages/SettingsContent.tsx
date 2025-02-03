import {
  Button,
  Card,
  Container,
  Flex,
  Input,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {getUserInfo} from "../api/queries/getUserInfo";
import {fetchUpdateInfo} from "../api/queries/updateInfo";
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

          <TextInput
            label='New Password'
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
            radius='md'
          />

          <TextInput
            label='Old Password'
            type='password'
            placeholder='Enter old password'
            value={oldPassword}
            onChange={e => setOldPassword(e.currentTarget.value)}
            radius='md'
          />
          <TextInput
            label='Confirm Password'
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.currentTarget.value);
              if (e.currentTarget.value === password) {
                setPasswordMatch(true);
              }
            }}
            radius='md'
            error={passwordMatch ? false : "Passwords do not match"}
          />
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
  );
}
