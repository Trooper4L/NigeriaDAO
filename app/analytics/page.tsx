"use client";

import { ElementType } from "react";
import { Activity, AlertCircle, Globe2, Vote } from "lucide-react";
import { Badge, Box, Grid, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { useCivic } from "@/components/providers/civic-provider";
import { MotionBox } from "@/components/ui/motion-box";

export default function AnalyticsPage() {
  const { analytics } = useCivic();
  const topStates = [...analytics.stateSentiment].sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Stack spacing={6}>
        <Heading size="lg">Civic Analytics</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
          <StatCard label="National Sentiment" value={analytics.nationalSentiment.toFixed(2)} icon={Activity} />
          <StatCard label="State Surfaces" value={String(analytics.stateSentiment.length)} icon={Globe2} />
          <StatCard label="Open Voting Sessions" value={String(analytics.openVoting)} icon={Vote} />
          <StatCard label="Moderation Queue" value={String(analytics.moderationQueue)} icon={AlertCircle} />
        </Grid>

        <Box p={5} rounded="xl" border="1px solid" borderColor="whiteAlpha.300" bg="rgba(14,21,32,0.8)">
          <Heading size="sm" mb={4}>
            State Sentiment Distribution
          </Heading>
          {topStates.length === 0 ? (
            <Text color="text.muted">Publish approved opinions to populate analytics.</Text>
          ) : (
            <Stack spacing={3}>
              {topStates.map((item, index) => {
                const pct = Math.min(100, Math.abs(item.sentiment) * 20 + item.count * 5);
                return (
                  <MotionBox
                    key={item.state}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <HStack justify="space-between" mb={1}>
                      <HStack spacing={2}>
                        <Text fontWeight="medium">{item.state}</Text>
                        <Badge colorScheme={item.sentiment >= 0 ? "green" : "orange"}>{item.sentiment}</Badge>
                      </HStack>
                      <Text fontSize="xs" color="text.muted">
                        {item.count} opinions
                      </Text>
                    </HStack>
                    <Box h={2} rounded="full" bg="whiteAlpha.200">
                      <Box
                        h="full"
                        rounded="full"
                        bg={item.sentiment >= 0 ? "nigeria.400" : "orange.400"}
                        w={`${pct}%`}
                        transition="width .35s ease"
                      />
                    </Box>
                  </MotionBox>
                );
              })}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ElementType }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      p={4}
      rounded="xl"
      border="1px solid"
      borderColor="whiteAlpha.300"
      bg="rgba(12,18,28,0.82)"
    >
      <HStack justify="space-between">
        <Stack spacing={1}>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="text.muted">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </Stack>
        <Icon as={icon} boxSize={5} color="flow.500" />
      </HStack>
    </MotionBox>
  );
}
