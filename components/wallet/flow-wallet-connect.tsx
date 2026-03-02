'use client';

import { Button, HStack, Text, Badge, useToast } from '@chakra-ui/react';
import { Wallet, LogOut } from 'lucide-react';
import { useFlow } from '@/lib/hooks/useFlow';

export function FlowWalletConnect() {
  const { isConnected, address, connect, disconnect, loading } = useFlow();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: 'Wallet connected',
        description: 'Your Flow wallet is now connected',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Failed to connect Flow wallet',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: 'Wallet disconnected',
        status: 'info',
        duration: 3000,
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  if (loading) {
    return (
      <Button
        size="sm"
        variant="outline"
        borderColor="rgba(0, 239, 139, 0.3)"
        color="#00EF8B"
        isLoading
      >
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <HStack
        spacing={2}
        bg="rgba(0, 135, 81, 0.1)"
        border="1px solid rgba(0, 135, 81, 0.3)"
        borderRadius="md"
        px={3}
        py={2}
      >
        <Badge
          bg="rgba(0, 239, 139, 0.2)"
          color="#00EF8B"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="sm"
        >
          Flow
        </Badge>
        <Text fontSize="sm" color="gray.300" fontFamily="mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </Text>
        <Button
          size="xs"
          variant="ghost"
          color="gray.400"
          _hover={{ color: 'red.400' }}
          onClick={handleDisconnect}
          leftIcon={<LogOut size={12} />}
        >
          Disconnect
        </Button>
      </HStack>
    );
  }

  return (
    <Button
      leftIcon={<Wallet size={16} />}
      size="sm"
      bg="rgba(0, 135, 81, 0.2)"
      color="#00EF8B"
      border="1px solid rgba(0, 135, 81, 0.3)"
      _hover={{ bg: 'rgba(0, 135, 81, 0.3)' }}
      onClick={handleConnect}
    >
      Connect Flow Wallet
    </Button>
  );
}
