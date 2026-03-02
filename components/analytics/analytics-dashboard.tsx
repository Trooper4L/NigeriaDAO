'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  Text,
  Spinner,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { BarChart3, Users, Vote, MessageSquare, TrendingUp } from 'lucide-react';
import { AnalyticsService } from '@/lib/services/analytics';
import { CivicAnalytics } from '@/lib/types';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<CivicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await AnalyticsService.getCivicAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="#00EF8B" />
        <Text mt={4} color="gray.400">
          Loading analytics...
        </Text>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.400">Failed to load analytics</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack spacing={2}>
        <BarChart3 size={24} color="#00EF8B" />
        <Text fontSize="2xl" fontWeight="700" color="white">
          Civic Analytics Dashboard
        </Text>
      </HStack>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <Box
          bg="rgba(0, 135, 81, 0.1)"
          border="1px solid rgba(0, 135, 81, 0.3)"
          borderRadius="lg"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400" fontSize="sm">
              <HStack spacing={2}>
                <Vote size={16} />
                <Text>Total Proposals</Text>
              </HStack>
            </StatLabel>
            <StatNumber color="#00EF8B" fontSize="3xl" mt={2}>
              {analytics.totalProposals}
            </StatNumber>
            <StatHelpText color="gray.500">Active civic initiatives</StatHelpText>
          </Stat>
        </Box>

        <Box
          bg="rgba(0, 239, 139, 0.1)"
          border="1px solid rgba(0, 239, 139, 0.3)"
          borderRadius="lg"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400" fontSize="sm">
              <HStack spacing={2}>
                <Users size={16} />
                <Text>Total Votes</Text>
              </HStack>
            </StatLabel>
            <StatNumber color="#00EF8B" fontSize="3xl" mt={2}>
              {analytics.totalVotes}
            </StatNumber>
            <StatHelpText color="gray.500">Blockchain-verified</StatHelpText>
          </Stat>
        </Box>

        <Box
          bg="rgba(0, 135, 81, 0.1)"
          border="1px solid rgba(0, 135, 81, 0.3)"
          borderRadius="lg"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400" fontSize="sm">
              <HStack spacing={2}>
                <MessageSquare size={16} />
                <Text>Total Opinions</Text>
              </HStack>
            </StatLabel>
            <StatNumber color="#00EF8B" fontSize="3xl" mt={2}>
              {analytics.totalOpinions}
            </StatNumber>
            <StatHelpText color="gray.500">Stored on IPFS</StatHelpText>
          </Stat>
        </Box>

        <Box
          bg="rgba(0, 239, 139, 0.1)"
          border="1px solid rgba(0, 239, 139, 0.3)"
          borderRadius="lg"
          p={5}
        >
          <Stat>
            <StatLabel color="gray.400" fontSize="sm">
              <HStack spacing={2}>
                <TrendingUp size={16} />
                <Text>Sentiment Score</Text>
              </HStack>
            </StatLabel>
            <StatNumber color="#00EF8B" fontSize="3xl" mt={2}>
              {analytics.sentimentScore.toFixed(1)}%
            </StatNumber>
            <StatHelpText color="gray.500">National mood</StatHelpText>
          </Stat>
        </Box>
      </Grid>

      <Box
        bg="rgba(11, 14, 17, 0.6)"
        border="1px solid rgba(0, 239, 139, 0.15)"
        borderRadius="lg"
        p={6}
      >
        <Text fontSize="lg" fontWeight="600" color="#00EF8B" mb={4}>
          Regional Activity
        </Text>
        <VStack spacing={3} align="stretch">
          {analytics.regionalData.slice(0, 10).map((region) => (
            <HStack key={region.state} justify="space-between">
              <Text color="gray.300">{region.state}</Text>
              <HStack spacing={3}>
                <Badge
                  bg="rgba(0, 135, 81, 0.2)"
                  color="#00EF8B"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {region.proposalCount} proposals
                </Badge>
                <Badge
                  bg="rgba(0, 239, 139, 0.2)"
                  color="#00EF8B"
                  px={3}
                  py={1}
                  borderRadius="md"
                >
                  {region.voteCount} votes
                </Badge>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
