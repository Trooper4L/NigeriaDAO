'use client';

import { useEffect, useState } from 'react';
import { DAOTokenDisplay } from '@/components/dao/dao-token-display';
import {
  Box, Container, VStack, Text, Grid, HStack, Badge, Spinner, Progress,
} from '@chakra-ui/react';
import { Trophy, MapPin } from 'lucide-react';
import { AnalyticsService } from '@/lib/services/analytics';
import { RegionalData } from '@/lib/types';

export default function DAOPage() {
  const [regions, setRegions] = useState<RegionalData[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

  useEffect(() => {
    AnalyticsService.getRegionalData()
      .then((data) => setRegions(data.slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoadingRegions(false));
  }, []);

  const maxProposals = regions[0]?.proposalCount || 1;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="3xl" fontWeight="700" color="white" mb={2}>
            DAO Governance
          </Text>
          <Text color="gray.400">
            Participate in decentralized governance with NDAO tokens.
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <DAOTokenDisplay />

          <Box
            bg="rgba(0, 135, 81, 0.05)"
            border="1px solid rgba(0, 135, 81, 0.2)"
            borderRadius="lg"
            p={6}
          >
            <HStack spacing={2} mb={4}>
              <Trophy size={18} color="#00EF8B" />
              <Text fontSize="lg" fontWeight="600" color="#00EF8B">
                How to Earn NDAO Tokens
              </Text>
            </HStack>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text color="white" fontWeight="500">✓ Create Proposals</Text>
                <Badge bg="rgba(0,239,139,0.15)" color="#00EF8B">+25 NDAO</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text color="white" fontWeight="500">✓ Vote on Proposals</Text>
                <Badge bg="rgba(0,239,139,0.15)" color="#00EF8B">+10 NDAO</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text color="white" fontWeight="500">✓ Post Opinions</Text>
                <Badge bg="rgba(0,239,139,0.15)" color="#00EF8B">+5 NDAO</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text color="white" fontWeight="500">✓ Proposal Accepted</Text>
                <Badge bg="rgba(0,100,255,0.15)" color="blue.300">Contribution Badge NFT</Badge>
              </HStack>
            </VStack>
          </Box>
        </Grid>

        <Box
          bg="rgba(0, 135, 81, 0.05)"
          border="1px solid rgba(0, 135, 81, 0.2)"
          borderRadius="lg"
          p={6}
        >
          <HStack spacing={2} mb={5}>
            <MapPin size={18} color="#00EF8B" />
            <Text fontSize="lg" fontWeight="600" color="#00EF8B">
              Regional Civic Activity Leaderboard
            </Text>
          </HStack>

          {loadingRegions ? (
            <HStack justify="center" py={6}>
              <Spinner color="#00EF8B" size="sm" />
              <Text color="gray.500" fontSize="sm">Loading regions...</Text>
            </HStack>
          ) : regions.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={6}>No regional data yet.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {regions.map((region, index) => (
                <Box key={region.state}>
                  <HStack justify="space-between" mb={1}>
                    <HStack spacing={2}>
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'gray.500'}
                        w="20px"
                      >
                        #{index + 1}
                      </Text>
                      <Text color="white" fontWeight="500" fontSize="sm">{region.state}</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Badge bg="rgba(0,135,81,0.2)" color="#00EF8B" fontSize="xs">
                        {region.proposalCount} proposals
                      </Badge>
                      <Badge bg="rgba(0,239,139,0.15)" color="#00EF8B" fontSize="xs">
                        {region.voteCount} votes
                      </Badge>
                    </HStack>
                  </HStack>
                  <Progress
                    value={(region.proposalCount / maxProposals) * 100}
                    size="xs"
                    borderRadius="full"
                    bg="whiteAlpha.100"
                    sx={{ '& > div': { background: index < 3 ? '#00EF8B' : 'rgba(0,239,139,0.4)' } }}
                  />
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
