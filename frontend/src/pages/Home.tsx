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
import {Route, Routes, useNavigate} from "react-router-dom";
import {useMediaQuery} from "@mantine/hooks";
import logo from "../assets/Budgetly.svg";
import "../borderbox.css";
import {Navbar} from "../components/Navbar.tsx";
import {useModalStore} from "../states/modalStore.ts";
import {LogoutModal} from "../components/Modal.tsx";
import HomeContent from "./HomeContent.tsx";
import CalendarContent from "./CalendarContent.tsx";
import SettingsContent from "./SettingsContent.tsx";
import OptionsContent from "./OptionsContent.tsx";
import {jwtDecode} from "jwt-decode";
import {JWTPayload} from "../types/types.ts";
import ExpensesContent from "./ExpensesContent.tsx";

export function Home() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [opened, {toggle}] = useDisclosure();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {modalOpened, closeModal} = useModalStore();
  const validateToken = () => {
    if (!token) {
      localStorage.clear();
      navigate("/signin");
      return false;
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.clear();
        navigate("/signin");
        return false;
      }
      return true;
    } catch (error) {
      localStorage.clear();
      navigate("/signin");
      return false;
    }
  };
  useEffect(() => {
    validateToken();
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
        <AppShell.Main w={"100vw"}>
          <Routes>
            <Route path='/' element={<HomeContent />} />
            <Route path='/options' element={<OptionsContent />} />
            <Route path='/settings' element={<SettingsContent />} />
            <Route path='/calendar' element={<CalendarContent />} />
            <Route path='/expenses' element={<ExpensesContent />} />
          </Routes>
        </AppShell.Main>
      </AppShell>

      <LogoutModal opened={modalOpened} onClose={closeModal} />
    </>
  );
}
