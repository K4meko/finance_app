import {useState} from "react";
import {
  IconAdjustmentsHorizontal,
  IconCalendar,
  IconHome,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import {Code, Group} from "@mantine/core";
import {MantineLogo} from "@mantinex/mantine-logo";
import classes from "./NavbarSimple.module.css";

const data = [
  {link: "", label: "Home", icon: IconHome},
  {link: "", label: "Options", icon: IconAdjustmentsHorizontal},
  {link: "", label: "Account and Settings", icon: IconSettings},
  {link: "", label: "Calendar", icon: IconCalendar},
];

export function Navbar() {
  const [active, setActive] = useState("Billing");

  const links = data.map(item => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={event => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a
          href='#'
          className={classes.link}
          onClick={event => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href='#'
          className={classes.link}
          onClick={event => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
