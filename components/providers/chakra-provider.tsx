"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  },
  styles: {
    global: {
      body: {
        bg: "deepSpace.900",
        color: "gray.100"
      }
    }
  },
  colors: {
    brand: {
      500: "#008751"
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
