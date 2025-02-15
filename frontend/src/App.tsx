import {useState} from "react";
import "./borderbox.css";
import {Button, MantineProvider, createTheme, rem} from "@mantine/core";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {SignIn} from "./pages/SignIn";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import {Header} from "./components/Header";
import {Home} from "./pages/Home";
import {QueryClient, QueryClientProvider} from "react-query";
function App() {
  const queryClient = new QueryClient();
  const theme = createTheme({
    components: {
      Button: {
        //!ts-ignore
        styles: (theme: {colors: {red: any[]}}) => ({
          '&[data-variant="outline"][data-color="red"]': {
            borderColor: theme.colors.red[5],
            color: theme.colors.red[5],
            "&:hover": {
              borderColor: theme.colors.red[6],
              backgroundColor: theme.colors.red[1],
              color: theme.colors.red[6],
            },
          },
        }),
      },
    },
    colors: {
      red: [
        "#fff5f5",
        "#ffe3e3",
        "#ffc9c9",
        "#ffb1b1",
        "#ff9999",
        "#ff8585",
        "#ff7575",
        "#ff6b6b",
        "#ff5252",
        "#ff3f3f",
      ],
      deepBlue: [
        "#eef3ff",
        "#dce4f5",
        "#b9c7e2",
        "#94a8d0",
        "#748dc1",
        "#5f7cb8",
        "#5474b4",
        "#44639f",
        "#39588f",
        "#2d4b81",
      ],
      blue: [
        "#eef3ff",
        "#dee2f2",
        "#bdc2de",
        "#98a0ca",
        "#7a84ba",
        "#6672b0",
        "#5c68ac",
        "#4c5897",
        "#424e88",
        "#364379",
      ],
    },
    shadows: {
      md: "1px 1px 3px rgba(0, 0, 0, .25)",
      xl: "5px 5px 3px rgba(0, 0, 0, .25)",
    },
    headings: {
      fontFamily: "Roboto, sans-serif",
      sizes: {
        h1: {fontSize: rem(36)},
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme={"dark"}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='signin' element={<SignIn />} />
            <Route path='/home/*' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
