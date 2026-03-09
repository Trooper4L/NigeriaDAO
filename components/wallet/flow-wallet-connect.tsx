'use client';

import { Button, HStack, Text, Badge, VStack } from '@chakra-ui/react';
import { Wallet, LogOut } from 'lucide-react';
import { useFlow } from '@/lib/hooks/useFlow';

interface FlowWalletConnectProps {
  onOpenModal?: () => void;
}

export function FlowWalletConnect({ onOpenModal }: FlowWalletConnectProps = {}) {
  const { isConnected, address, disconnect, loading } = useFlow();

  if (loading) {
    return (
      <Button size="sm" variant="outline" borderColor="rgba(0,239,139,0.3)" color="#00EF8B" isLoading w="full">
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <VStack spacing={2} align="stretch">
        <HStack
          spacing={2}
          bg="rgba(0,135,81,0.1)"
          border="1px solid rgba(0,135,81,0.3)"
          borderRadius="lg"
          px={3}
          py={2}
          cursor="pointer"
          onClick={onOpenModal}
          _hover={{ borderColor: 'rgba(0,239,139,0.4)' }}
        >
          <Badge bg="rgba(0,239,139,0.2)" color="#00EF8B" fontSize="xs" px={2} py={0.5} borderRadius="sm">
            Flow
          </Badge>
          <Text fontSize="xs" color="gray.300" fontFamily="mono" flex={1}>
            {address.slice(0, 8)}...{address.slice(-4)}
          </Text>
          <Button
            size="xs"
            variant="ghost"
            color="gray.500"
            _hover={{ color: 'red.400' }}
            onClick={(e) => { e.stopPropagation(); disconnect(); }}
            leftIcon={<LogOut size={11} />}
            px={1}
          >
            Out
          </Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <Button
      leftIcon={<Wallet size={15} />}
      size="sm"
      w="full"
      bg="rgba(0,135,81,0.15)"
      color="#00EF8B"
      border="1px solid rgba(0,135,81,0.3)"
      _hover={{ bg: 'rgba(0,135,81,0.25)' }}
      onClick={onOpenModal || (() => {})}
    >
      Connect Flow Wallet
    </Button>
  );
}
