"use client";

import { ElementType, useEffect, useState } from "react";
import { Coins, ShieldCheck, Wallet } from "lucide-react";
import {
  Box, Grid, Heading, HStack, Icon, Spinner, Stack, Text,
} from "@chakra-ui/react";
import { ProposalFeed } from "@/components/parliament/proposal-feed";
import { ProposalService } from "@/lib/services/proposal";
import { AnalyticsService } from "@/lib/services/analytics";
import { api } from "@/lib/api/client";

export default function GovernancePage() {
  const [totalProposals, setTotalProposals] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState<number | null>(null);
  const [acceptedCount, setAcceptedCount] = useState<number | null>(null);

  useEffect(() => {
    const loadData = () => {
      AnalyticsService.getCivicAnalytics().then((data) => {
        setTotalProposals(data.totalProposals);
        setTotalVotes(data.totalVotes);
      }).catch(() => setTotalProposals(0));

      ProposalService.getProposals().then((data) => {
        setAcceptedCount(data.filter((p) => p.status === "Accepted").length);
      }).catch(() => setAcceptedCount(0));
    };

    loadData();
    api.post('/api/resolve', {}).catch(() => {});

    const interval = setInterval(() => {
      api.post('/api/resolve', {}).catch(() => {});
      loadData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Stack spacing={6}>
        <Heading size="lg">DAO Governance</Heading>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <InfoCard
            icon={Wallet}
            title="Total Proposals"
            value={totalProposals !== null ? String(totalProposals) : null}
          />
          <InfoCard
            icon={Coins}
            title="Total Votes Cast"
            value={totalVotes !== null ? String(totalVotes) : null}
          />
          <InfoCard
            icon={ShieldCheck}
            title="Accepted Proposals"
            value={acceptedCount !== null ? String(acceptedCount) : null}
          />
        </Grid>

        <Box p={5} rounded="xl" border="1px solid" borderColor="whiteAlpha.300" bg="rgba(14,21,32,0.8)">
          <Heading size="sm" mb={4}>
            Active Proposals
          </Heading>
          <ProposalFeed />
        </Box>
      </Stack>
    </Box>
  );
}

function InfoCard({ title, value, icon }: { title: string; value: string | null; icon: ElementType }) {
  return (
    <Box
      p={4}
      rounded="xl"
      border="1px solid"
      borderColor="whiteAlpha.300"
      bg="rgba(12,18,28,0.82)"
    >
      <HStack justify="space-between">
        <Stack spacing={1}>
          <Text fontSize="xs" textTransform="uppercase" color="text.muted" letterSpacing="0.08em">
            {title}
          </Text>
          {value === null ? (
            <Spinner size="sm" color="#00EF8B" />
          ) : (
            <Text fontWeight="bold">{value}</Text>
          )}
        </Stack>
        <Icon as={icon} boxSize={5} color="flow.500" />
      </HStack>
    </Box>
  );
}
