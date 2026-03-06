"use client";

import NextLink from "next/link";
import { ArrowRight, BarChart3, FileText, ShieldCheck, Vote } from "lucide-react";
import { Badge, Box, Button, Grid, GridItem, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { useCivic } from "@/components/providers/civic-provider";
import { MotionBox } from "@/components/ui/motion-box";

export default function Home() {
  const { analytics, store } = useCivic();

  const cards = [
    {
      label: "Active Proposals",
      value: String(store.proposals.length),
      helper: `${analytics.openVoting} in voting`,
      icon: Vote,
      color: "nigeria.300"
    },
    {
      label: "Published Opinions",
      value: String(store.opinions.filter((o) => o.moderationStatus === "approved").length),
      helper: `${analytics.moderationQueue} flagged`,
      icon: FileText,
      color: "flow.500"
    },
    {
      label: "National Sentiment",
      value: analytics.nationalSentiment.toFixed(2),
      helper: "AI-assisted score",
      icon: BarChart3,
      color: "blue.300"
    }
  ];

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Stack spacing={8}>
        <MotionBox initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Grid
            gap={5}
            templateColumns={{ base: "1fr", lg: "1.6fr 1fr" }}
            p={{ base: 5, md: 8 }}
            rounded="2xl"
            border="1px solid"
            borderColor="whiteAlpha.300"
            bg="linear-gradient(115deg, rgba(0, 135, 81, 0.24), rgba(0, 239, 139, 0.08) 55%, rgba(255,255,255,0.02))"
          >
            <GridItem>
              <Badge bg="whiteAlpha.200" color="white" px={3} py={1} rounded="full" mb={3}>
                Nigeria DAO Parliament
              </Badge>
              <Heading size={{ base: "lg", md: "xl" }} lineHeight="1.2">
                Build civic trust with anonymous participation and verifiable public records.
              </Heading>
              <Text mt={3} color="text.muted" maxW="2xl">
                A professional civic interface for opinions, proposals, secure voting, analytics, and governance
                readiness.
              </Text>
              <HStack mt={6} spacing={3}>
                <Button as={NextLink} href="/parliament" rightIcon={<ArrowRight size={16} />}>
                  Launch Parliament
                </Button>
                <Button as={NextLink} href="/opinions" variant="outline">
                  Publish Opinion
                </Button>
              </HStack>
            </GridItem>
            <GridItem>
              <Stack spacing={3}>
                <HStack spacing={2}>
                  <Icon as={ShieldCheck} color="flow.500" boxSize={5} />
                  <Text fontWeight="semibold">Protection + transparency</Text>
                </HStack>
                <Text fontSize="sm" color="text.muted">
                  Every entry generates a deterministic CID and Flow-style transaction proof for testnet workflows.
                </Text>
              </Stack>
            </GridItem>
          </Grid>
        </MotionBox>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          {cards.map((card, index) => (
            <MotionBox
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              p={5}
              rounded="xl"
              border="1px solid"
              borderColor="whiteAlpha.200"
              bg="rgba(14, 21, 32, 0.72)"
            >
              <HStack justify="space-between" align="flex-start">
                <Stack spacing={1}>
                  <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.1em" color="text.muted">
                    {card.label}
                  </Text>
                  <Heading size="lg">{card.value}</Heading>
                  <Text fontSize="sm" color="text.muted">
                    {card.helper}
                  </Text>
                </Stack>
                <Icon as={card.icon} color={card.color} boxSize={5} />
              </HStack>
            </MotionBox>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
