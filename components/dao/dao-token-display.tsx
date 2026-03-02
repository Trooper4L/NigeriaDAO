'use client';

import { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Badge, Spinner } from '@chakra-ui/react';
import { Coins, Award } from 'lucide-react';
import { DAOService } from '@/lib/services/dao';
import { useFlow } from '@/lib/hooks/useFlow';
import { DAOToken } from '@/lib/types';

export function DAOTokenDisplay() {
  const { address, isConnected } = useFlow();
  const [tokenData, setTokenData] = useState<DAOToken | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadTokenData();
    }
  }, [isConnected, address]);

  const loadTokenData = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const data = await DAOService.getTokenBalance(address);
      setTokenData(data);
    } catch (error) {
      console.error('Failed to load token data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <HStack spacing={2}>
          <Coins size={20} color="#00EF8B" />
          <Text fontSize="lg" fontWeight="600" color="#00EF8B">
            NDAO Governance Tokens
          </Text>
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
