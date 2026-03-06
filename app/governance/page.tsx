"use client";

import { ElementType } from "react";
import { Coins, ShieldCheck, Wallet } from "lucide-react";
import { Badge, Box, Button, Grid, Heading, HStack, Icon, Stack, Text, useToast } from "@chakra-ui/react";
import { useCivic } from "@/components/providers/civic-provider";
import { MotionBox } from "@/components/ui/motion-box";

const treasuryInitiatives = [
  {
    id: "treasury_education",
    title: "State Education Transparency Engine",
    budget: "125,000 NDAO",
    impact: "Public disbursement verification"
  },
  {
    id: "treasury_health",
    title: "Primary Health Inventory Trace",
    budget: "88,000 NDAO",
    impact: "Drug stock accountability"
  }
];

export default function GovernancePage() {
  const toast = useToast();
  const { store, castVote } = useCivic();
  const votingProposals = store.proposals.filter((proposal) => proposal.status === "Voting");

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Stack spacing={6}>
        <Heading size="lg">DAO Governance</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <InfoCard icon={Wallet} title="Treasury Mode" value="Testnet Active" />
          <InfoCard icon={Coins} title="NDAO Governance" value="Community Voting" />
          <InfoCard icon={ShieldCheck} title="Execution" value="Manual Safeguards" />
        </Grid>

        <Box p={5} rounded="xl" border="1px solid" borderColor="whiteAlpha.300" bg="rgba(14,21,32,0.8)">
          <Heading size="sm" mb={4}>
            Treasury Initiatives
          </Heading>
          <Stack spacing={3}>
            {treasuryInitiatives.map((item, index) => (
              <MotionBox
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                p={4}
                rounded="lg"
                bg="rgba(9,14,21,0.8)"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <HStack justify="space-between" align="start">
                  <Stack spacing={1}>
                    <Text fontWeight="semibold">{item.title}</Text>
                    <Text fontSize="sm" color="text.muted">
                      {item.impact}
                    </Text>
                  </Stack>
                  <Badge colorScheme="green">{item.budget}</Badge>
                </HStack>
              </MotionBox>
            ))}
          </Stack>
        </Box>

        <Box p={5} rounded="xl" border="1px solid" borderColor="whiteAlpha.300" bg="rgba(14,21,32,0.8)">
          <Heading size="sm" mb={4}>
            Governance Voting (Mirrors Parliament Voting Stage)
          </Heading>
          {votingProposals.length === 0 ? (
            <Text color="text.muted">No proposals are currently in voting stage.</Text>
          ) : (
            <Stack spacing={3}>
              {votingProposals.map((proposal) => (
                <HStack
                  key={proposal.id}
                  p={3}
                  rounded="lg"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  bg="rgba(9,14,21,0.8)"
                  justify="space-between"
                  align="start"
                >
                  <Stack spacing={1}>
                    <Text fontWeight="semibold">{proposal.title}</Text>
                    <Text color="text.muted" fontSize="sm">
                      {proposal.summary}
                    </Text>
                  </Stack>
                  <HStack>
                    <Button
                      size="sm"
                      onClick={() => {
                        const result = castVote(proposal.id, "support");
                        toast({ status: result.ok ? "success" : "warning", description: result.message });
                      }}
                    >
                      Support
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const result = castVote(proposal.id, "against");
                        toast({ status: result.ok ? "success" : "warning", description: result.message });
                      }}
                    >
                      Against
                    </Button>
                  </HStack>
                </HStack>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

function InfoCard({ title, value, icon }: { title: string; value: string; icon: ElementType }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
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
          <Text fontWeight="bold">{value}</Text>
        </Stack>
        <Icon as={icon} boxSize={5} color="flow.500" />
      </HStack>
    </MotionBox>
  );
}
