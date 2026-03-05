"use client";

import { BadgeCheck, Fingerprint, RefreshCcw, Shield } from "lucide-react";
import { Box, Button, HStack, Icon, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useCivic } from "@/components/providers/civic-provider";

export function AnonymityBadge() {
  const { store, refreshIdentity } = useCivic();

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex={20}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      bg="rgba(6, 9, 13, 0.82)"
      backdropFilter="blur(10px)"
    >
      <HStack maxW="7xl" mx="auto" px={{ base: 4, md: 6 }} py={3} justify="space-between" spacing={4}>
        <HStack spacing={3} align="center">
          <Box p={2} rounded="full" bg="nigeria.500" color="white">
            <Icon as={Shield} boxSize={4} />
          </Box>
          <Stack spacing={0}>
            <Text fontSize="xs" letterSpacing="0.15em" textTransform="uppercase" color="text.muted">
              Anonymity Layer
            </Text>
            <HStack spacing={2}>
              <Text fontWeight="semibold" fontSize="sm">
                {store.identity.alias}
              </Text>
              <HStack
                spacing={1}
                px={2}
                py={0.5}
                rounded="full"
                bg="rgba(0,239,139,0.12)"
                border="1px solid"
                borderColor="rgba(0,239,139,0.45)"
              >
                <Icon as={BadgeCheck} boxSize={3} color="flow.500" />
                <Text color="flow.500" fontSize="10px" fontWeight="bold" letterSpacing="0.08em">
                  VERIFIED
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </HStack>

        <HStack spacing={2}>
          <Tooltip label={store.identity.id}>
            <HStack px={3} py={1.5} rounded="full" border="1px solid" borderColor="whiteAlpha.300" bg="whiteAlpha.100">
              <Icon as={Fingerprint} boxSize={3} color="text.muted" />
              <Text fontSize="xs" color="text.muted">
                {store.identity.id.slice(-10)}
              </Text>
            </HStack>
          </Tooltip>
          <Button size="sm" leftIcon={<RefreshCcw size={14} />} variant="outline" onClick={refreshIdentity}>
            Rotate Alias
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
