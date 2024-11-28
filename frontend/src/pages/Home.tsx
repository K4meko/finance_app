import {AppShell, Burger, Image} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import logo from "../assets/Budgetly.svg";

export function Home() {
  const [opened, {toggle}] = useDisclosure();
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/signin";
    return null;
  }

  return (
    <AppShell
      header={{height: 60}}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: {mobile: !opened},
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>
          <img style={{marginTop: 10, marginLeft: 10}} src={logo}></img>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
