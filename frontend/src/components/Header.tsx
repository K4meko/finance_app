import {Flex} from "@mantine/core";

import logo from "../assets/Budgetly.svg";
export function Header() {
  return (
    <Flex
      align='flex-start'
      w='100%'
      style={{
        paddingBottom: 10,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <img src={logo} alt='logo' style={{marginLeft: 10, marginTop: 10}} />
    </Flex>
  );
}
