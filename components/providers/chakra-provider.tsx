"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  },
  fonts: {
    heading: "var(--font-display)",
    body: "var(--font-body)"
  },
  semanticTokens: {
    colors: {
      "bg.canvas": "#06090D",
      "bg.panel": "#0E1520",
      "bg.panelAlt": "#141F2D",
      "text.primary": "#F4F8FF",
      "text.muted": "#A9BDD0",
      "accent.primary": "#008751",
      "accent.secondary": "#00EF8B"
    }
  },
  styles: {
    global: {
      "html, body": {
        bg: "bg.canvas",
        color: "text.primary"
      },
      "::selection": {
        bg: "accent.primary",
        color: "white"
      }
    }
  },
  colors: {
    nigeria: {
      50: "#E5F9EF",
      100: "#B6EFD2",
      200: "#88E4B6",
      300: "#5BD99A",
      400: "#2DCE7E",
      500: "#008751",
      600: "#006C42",
      700: "#005234",
      800: "#003825",
      900: "#001F14"
    },
    flow: {
      500: "#00EF8B"
    },
    deepSpace: {
      900: "#0B0E11"
    }
  }
});

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
