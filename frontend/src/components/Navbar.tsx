import {useState} from "react";
import {
  IconAdjustmentsHorizontal,
  IconCalendar,
  IconChartPie,
  IconCoins,
  IconHome,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import classes from "./NavbarSimple.module.css";
import {useModalStore} from "../states/modalStore";

const data = [
  {link: "/home", label: "Home", icon: IconHome},
  {link: "/home/options", label: "Options", icon: IconChartPie},
  {link: "/home/settings", label: "Account and Settings", icon: IconSettings},
  {link: "/home/calendar", label: "Calendar", icon: IconCalendar},
  {link: "/home/expenses", label: "Expenses", icon: IconCoins},
];

export function Navbar() {
  const [active, setActive] = useState("Billing");
  const {modalOpened, openModal} = useModalStore();

  const links = data.map(item => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
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
          onClick={event => {
            event.preventDefault();
            openModal();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
