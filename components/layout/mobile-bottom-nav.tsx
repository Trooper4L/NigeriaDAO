"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Home, ShieldCheck, Vote } from "lucide-react";
import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/parliament", label: "Parliament", icon: Vote },
  { href: "/opinions", label: "Opinions", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/governance", label: "Governance", icon: ShieldCheck }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={30}
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
      bg="rgba(6, 9, 13, 0.95)"
      backdropFilter="blur(8px)"
      display={{ base: "block", md: "none" }}
      px={2}
      py={2}
    >
      <HStack justify="space-between" spacing={1} maxW="container.md" mx="auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <VStack
              key={item.href}
              as={NextLink}
              href={item.href}
              spacing={1}
              flex={1}
              py={1.5}
              rounded="xl"
              bg={active ? "rgba(0, 135, 81, 0.22)" : "transparent"}
              color={active ? "nigeria.200" : "text.muted"}
              transition="all .2s"
            >
              <Icon as={item.icon} boxSize={4} />
              <Text fontSize="10px" letterSpacing="0.03em" fontWeight={active ? "bold" : "medium"}>
                {item.label}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
}
