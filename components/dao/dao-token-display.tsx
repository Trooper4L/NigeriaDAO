'use client';

import { useCallback, useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Badge, Spinner, IconButton } from '@chakra-ui/react';
import { Coins, Award, RefreshCw } from 'lucide-react';
import { FlowService } from '@/lib/services/flow';
import { useFlow } from '@/lib/hooks/useFlow';
import { DAOToken } from '@/lib/types';

export function DAOTokenDisplay() {
  const { address, isConnected } = useFlow();
  const [tokenData, setTokenData] = useState<DAOToken | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTokenData = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const balance = await FlowService.getDAOTokenBalance(address);
      setTokenData({ balance, staked: 0, votingPower: balance });
    } catch (error) {
      console.error('Failed to load token data:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      loadTokenData();
      const interval = setInterval(loadTokenData, 15000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address, loadTokenData]);

  if (!isConnected) {
    return (
      <Box
        bg="rgba(0, 135, 81, 0.05)"
        border="1px solid rgba(0, 135, 81, 0.2)"
        borderRadius="lg"
        p={4}
        textAlign="center"
      >
        <Text color="gray.400" fontSize="sm">
          Connect Flow wallet to view NDAO tokens
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        bg="rgba(0, 135, 81, 0.05)"
        border="1px solid rgba(0, 135, 81, 0.2)"
        borderRadius="lg"
        p={4}
        textAlign="center"
      >
        <Spinner size="sm" color="#00EF8B" />
      </Box>
    );
  }

  return (
    <Box
      bg="rgba(0, 135, 81, 0.05)"
      border="1px solid rgba(0, 135, 81, 0.2)"
      borderRadius="lg"
      p={5}
    >
      <VStack spacing={4} align="stretch">
        <HStack spacing={2} justify="space-between">
          <HStack spacing={2}>
            <Coins size={20} color="#00EF8B" />
            <Text fontSize="lg" fontWeight="600" color="#00EF8B">
              NDAO Governance Tokens
            </Text>
          </HStack>
          <IconButton
            aria-label="Refresh balance"
            icon={<RefreshCw size={14} />}
            size="xs"
            variant="ghost"
            color="gray.400"
            _hover={{ color: '#00EF8B' }}
            onClick={loadTokenData}
            isLoading={loading}
          />
        </HStack>

        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500">
              Balance
            </Text>
            <Text fontSize="2xl" fontWeight="700" color="white">
              {tokenData?.balance.toFixed(2) || '0.00'}
            </Text>
          </VStack>

          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500">
              Staked
            </Text>
            <Text fontSize="2xl" fontWeight="700" color="#00EF8B">
              {tokenData?.staked.toFixed(2) || '0.00'}
            </Text>
          </VStack>

          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color="gray.500">
              Voting Power
            </Text>
            <Badge
              bg="rgba(0, 239, 139, 0.2)"
              color="#00EF8B"
              fontSize="lg"
              px={3}
              py={1}
              borderRadius="md"
            >
              {tokenData?.votingPower.toFixed(0) || '0'}
            </Badge>
          </VStack>
        </HStack>

        <Box
          bg="rgba(0, 239, 139, 0.05)"
          borderRadius="md"
          p={3}
          border="1px solid rgba(0, 239, 139, 0.1)"
        >
          <HStack spacing={2}>
            <Award size={16} color="#00EF8B" />
            <Text fontSize="sm" color="gray.400">
              Earn more NDAO by creating proposals and voting
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
