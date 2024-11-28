import {useState} from "react";
import {MantineProvider, createTheme, rem} from "@mantine/core";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {SignIn} from "./pages/SignIn";
import "@mantine/core/styles.css";
import {Header} from "./components/Header";
import {Home} from "./pages/Home";
import {QueryClient, QueryClientProvider} from "react-query";
function App() {
  const queryClient = new QueryClient();
  const theme = createTheme({
    colors: {
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
      // or replace default theme color
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
            <Route path="/" element={<Home />}>
              <Route path="signin" element={<SignIn />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
