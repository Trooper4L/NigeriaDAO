'use client';

import { useEffect, useState } from 'react';
import {
  Box, Container, VStack, HStack, Text, Spinner, Tabs, TabList,
  Tab, TabPanels, TabPanel, Divider,
} from '@chakra-ui/react';
import { OpinionForm } from './opinion-form';
import { OpinionCard } from './opinion-card';
import { OpinionService } from '@/lib/services/opinion';
import { Opinion } from '@/lib/types';

export function OpinionsFeed() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [trending, setTrending] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    Promise.all([OpinionService.getOpinions(), OpinionService.getTrendingOpinions()])
      .then(([all, trend]) => { setOpinions(all); setTrending(trend); })
      .catch((e) => console.error('Failed to fetch opinions', e));
  };

  useEffect(() => {
    Promise.all([OpinionService.getOpinions(), OpinionService.getTrendingOpinions()])
      .then(([all, trend]) => { setOpinions(all); setTrending(trend); })
      .catch((e) => console.error('Failed to fetch opinions', e))
      .finally(() => setLoading(false));
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePosted = () => { setTimeout(refresh, 1500); };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="3xl" fontWeight="700" color="white" mb={2}>
            Civic Opinions
          </Text>
          <Text color="gray.400">
            Post your thoughts anonymously. Stored on Filecoin, verified on Flow blockchain.
          </Text>
        </Box>

        <OpinionForm onPosted={handlePosted} />

        <Divider borderColor="whiteAlpha.200" />

        <Tabs variant="unstyled">
          <TabList gap={2} mb={4}>
            {['Latest', 'Trending'].map((label) => (
              <Tab
                key={label}
                px={4} py={1.5}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                color="gray.400"
                border="1px solid transparent"
                _selected={{
                  color: '#00EF8B',
                  borderColor: 'rgba(0,239,139,0.4)',
                  bg: 'rgba(0,239,139,0.08)',
                }}
              >
                {label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              {loading ? (
                <HStack justify="center" py={12}>
                  <Spinner color="#00EF8B" />
                  <Text color="gray.500">Loading opinions...</Text>
                </HStack>
              ) : opinions.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={12}>
                  No opinions yet. Be the first to share yours!
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {opinions.map((op) => (
                    <OpinionCard key={op.id} opinion={op} onCommentPosted={refresh} />
                  ))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel p={0}>
              {loading ? (
                <HStack justify="center" py={12}>
                  <Spinner color="#00EF8B" />
                </HStack>
              ) : trending.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={12}>
                  No trending opinions yet.
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {trending.map((op) => (
                    <OpinionCard key={op.id} opinion={{ ...op, trending: true }} onCommentPosted={refresh} />
                  ))}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
