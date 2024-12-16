import {
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Portal,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useMediaQuery} from "@mantine/hooks";
import logo from "../assets/Budgetly.svg";
import "../borderbox.css";
import {Navbar} from "../components/Navbar.tsx";
import {useModalStore} from "../states/modalStore.ts";
import {LogoutModal} from "../components/Modal.tsx";

export function Home() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [opened, {toggle}] = useDisclosure();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {modalOpened, closeModal} = useModalStore();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  return (
    <>
      <AppShell
        header={{height: 60}}
        navbar={{width: 300, breakpoint: "sm", collapsed: {mobile: !opened}}}
        padding='md'
      >
        <AppShell.Header>
          <Group h='100%' px='md'>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
            />
            <Image
              src={logo}
              alt='Budgetly'
              style={{width: "100px", height: "auto"}}
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Navbar />
        </AppShell.Navbar>
        <AppShell.Main>Main</AppShell.Main>
      </AppShell>

      <LogoutModal opened={modalOpened} onClose={closeModal} />
    </>
  );
}
