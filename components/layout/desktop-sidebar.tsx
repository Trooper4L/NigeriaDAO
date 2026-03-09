"use client";

import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Coins, FileText, Home, ShieldCheck, Vote } from "lucide-react";
import { Box, HStack, Icon, Stack, Text, VStack, useDisclosure, Divider } from "@chakra-ui/react";
import { FlowWalletModal } from "@/components/wallet/flow-wallet-modal";
import { FlowWalletConnect } from "@/components/wallet/flow-wallet-connect";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/parliament", label: "Parliament", icon: Vote },
  { href: "/opinions", label: "Opinions", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/governance", label: "Governance", icon: ShieldCheck },
  { href: "/dao", label: "DAO & Tokens", icon: Coins },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as="aside"
      display={{ base: "none", lg: "block" }}
      w="280px"
      border="1px solid"
      borderColor="whiteAlpha.200"
      bg="rgba(8, 12, 18, 0.78)"
      backdropFilter="blur(10px)"
      rounded="2xl"
      p={4}
      h="fit-content"
      position="sticky"
      top="88px"
    >
      <HStack spacing={3} px={2} py={3} mb={3}>
        <Image
          src="/naijadao-logo.png"
          alt="NaijaDAO Logo"
          width={40}
          height={40}
          style={{ borderRadius: '10px', objectFit: 'contain' }}
        />
        <Stack spacing={0}>
          <Text fontWeight="bold" fontSize="sm">
            NaijaDAO
          </Text>
          <Text fontSize="xs" color="text.muted">
            Parliament Portal
          </Text>
        </Stack>
      </HStack>

      <VStack spacing={1} align="stretch">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <HStack
              key={item.href}
              as={NextLink}
              href={item.href}
              spacing={3}
              px={3}
              py={2.5}
              rounded="xl"
              bg={active ? "rgba(0, 239, 139, 0.14)" : "transparent"}
              border="1px solid"
              borderColor={active ? "rgba(0, 239, 139, 0.45)" : "transparent"}
              color={active ? "flow.500" : "text.muted"}
              _hover={{ color: "text.primary", bg: "whiteAlpha.100" }}
              transition="all .2s"
            >
              <Icon as={item.icon} boxSize={4} />
              <Text fontSize="sm" fontWeight={active ? "semibold" : "medium"}>
                {item.label}
              </Text>
            </HStack>
          );
        })}
      </VStack>

      <Divider borderColor="whiteAlpha.100" mt={4} mb={3} />
      <Box px={1}>
        <FlowWalletConnect onOpenModal={onOpen} />
      </Box>

      <FlowWalletModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
