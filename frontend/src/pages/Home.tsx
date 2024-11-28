import {AppShell, Burger, Group, Image, Skeleton} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useMediaQuery} from "@mantine/hooks";
import logo from "../assets/Budgetly.svg";

export function Home() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [opened, {toggle}] = useDisclosure();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const imgSize = isSmallScreen ? "50%" : "default";
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);
  if (isSmallScreen) {
  }
  return (
    <AppShell
      header={{height: 60}}
      navbar={{width: 300, breakpoint: "sm", collapsed: {mobile: !opened}}}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Image
            src={logo}
            alt='Budgetly'
            style={{width: "100px", height: "auto"}}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt='sm' animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
