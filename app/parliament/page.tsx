"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarClock, Check, ChevronRight, Gauge, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  Stack,
  Tag,
  Text,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { useCivic } from "@/components/providers/civic-provider";
import { MotionBox } from "@/components/ui/motion-box";
import { NIGERIAN_STATES } from "@/lib/civic-engine";
import { ProposalStatus } from "@/lib/civic-types";

const statusColors: Record<ProposalStatus, string> = {
  Draft: "gray",
  "Public Discussion": "blue",
  Voting: "green",
  Accepted: "teal",
  Rejected: "red"
};

export default function ParliamentPage() {
  const toast = useToast();
  const { store, createProposal, castVote, getProposalMetrics, transitionProposal, finalizeVote } = useCivic();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    details: "",
    state: "FCT",
    tags: "",
    voteDeadline: ""
  });

  const sortedProposals = useMemo(
    () => [...store.proposals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [store.proposals]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title || !form.summary || !form.details || !form.voteDeadline) {
      toast({ status: "error", description: "Complete all required proposal fields." });
      return;
    }

    setLoading(true);
    await createProposal({
      title: form.title,
      summary: form.summary,
      details: form.details,
      state: form.state,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      voteDeadline: form.voteDeadline
    });
    setLoading(false);
    setForm({ title: "", summary: "", details: "", state: "FCT", tags: "", voteDeadline: "" });
    toast({ status: "success", description: "Proposal published with flow proof + CID." });
  };

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Grid templateColumns={{ base: "1fr", xl: "1.1fr 1.4fr" }} gap={6}>
        <MotionBox
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          p={5}
          rounded="xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
          bg="rgba(14,21,32,0.8)"
          h="fit-content"
        >
          <HStack mb={3} spacing={2}>
            <Icon as={Plus} boxSize={5} color="flow.500" />
            <Heading size="md">Create Civic Proposal</Heading>
          </HStack>
          <Text color="text.muted" fontSize="sm" mb={4}>
            Proposals start in Draft and can move through public discussion and voting.
          </Text>
          <Box as="form" onSubmit={onSubmit}>
            <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Summary</FormLabel>
              <Textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Details</FormLabel>
              <Textarea
                rows={4}
                value={form.details}
                onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
              />
            </FormControl>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
              <FormControl isRequired>
                <FormLabel>State</FormLabel>
                <Select value={form.state} onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))}>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Vote Deadline</FormLabel>
                <Input
                  type="datetime-local"
                  value={form.voteDeadline}
                  onChange={(e) => setForm((s) => ({ ...s, voteDeadline: e.target.value }))}
                />
              </FormControl>
            </Grid>
            <FormControl>
              <FormLabel>Tags (comma separated)</FormLabel>
              <Input value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
            </FormControl>
            <Button type="submit" isLoading={loading}>
              Submit Proposal
            </Button>
            </Stack>
          </Box>
        </MotionBox>

        <Stack spacing={4}>
          <Heading size="md">Proposal Feed</Heading>
          {sortedProposals.length === 0 ? (
            <Box p={6} rounded="xl" border="1px dashed" borderColor="whiteAlpha.300">
              <Text color="text.muted">No proposals yet. Publish the first one for this wave.</Text>
            </Box>
          ) : (
            sortedProposals.map((proposal, index) => {
              const metrics = getProposalMetrics(proposal.id);
              return (
                <MotionBox
                  key={proposal.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  p={5}
                  rounded="xl"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  bg="rgba(12,18,28,0.82)"
                >
                  <HStack justify="space-between" align="start" mb={3}>
                    <Stack spacing={1}>
                      <Heading size="sm">{proposal.title}</Heading>
                      <Text fontSize="sm" color="text.muted">
                        {proposal.summary}
                      </Text>
                    </Stack>
                    <Badge colorScheme={statusColors[proposal.status]}>{proposal.status}</Badge>
                  </HStack>

                  <HStack spacing={2} mb={3} flexWrap="wrap">
                    <Tag colorScheme="green">{proposal.state}</Tag>
                    {proposal.tags.map((tag) => (
                      <Tag key={`${proposal.id}_${tag}`} colorScheme="gray">
                        {tag}
                      </Tag>
                    ))}
                    <Tag colorScheme="purple">
                      <HStack spacing={1}>
                        <CalendarClock size={12} />
                        <Text>{new Date(proposal.voteDeadline).toLocaleString()}</Text>
                      </HStack>
                    </Tag>
                  </HStack>

                  <Text fontSize="sm" color="text.muted" mb={3}>
                    {proposal.details}
                  </Text>

                  <Stack spacing={2} mb={3}>
                    <HStack justify="space-between" fontSize="xs" color="text.muted">
                      <Text>Support {metrics.support}</Text>
                      <Text>Against {metrics.against}</Text>
                      <Text>Total {metrics.total}</Text>
                    </HStack>
                    <Box h={2} rounded="full" bg="whiteAlpha.200" overflow="hidden">
                      <Box h="full" bg="nigeria.400" w={`${metrics.supportPct}%`} transition="width .35s ease" />
                    </Box>
                  </Stack>

                  <HStack spacing={2} flexWrap="wrap">
                    {proposal.status === "Voting" && (
                      <>
                        <Button
                          size="sm"
                          leftIcon={<ThumbsUp size={14} />}
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
                          leftIcon={<ThumbsDown size={14} />}
                          onClick={() => {
                            const result = castVote(proposal.id, "against");
                            toast({ status: result.ok ? "success" : "warning", description: result.message });
                          }}
                        >
                          Against
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<Check size={14} />}
                          onClick={() => {
                            const result = finalizeVote(proposal.id);
                            toast({ status: result.ok ? "success" : "warning", description: result.message });
                          }}
                        >
                          Finalize
                        </Button>
                      </>
                    )}

                    {proposal.status === "Draft" && (
                      <Button
                        size="sm"
                        leftIcon={<ChevronRight size={14} />}
                        onClick={() => {
                          const result = transitionProposal(proposal.id, "Public Discussion");
                          toast({ status: result.ok ? "success" : "warning", description: result.message });
                        }}
                      >
                        Open Discussion
                      </Button>
                    )}
                    {proposal.status === "Public Discussion" && (
                      <Button
                        size="sm"
                        leftIcon={<Gauge size={14} />}
                        onClick={() => {
                          const result = transitionProposal(proposal.id, "Voting");
                          toast({ status: result.ok ? "success" : "warning", description: result.message });
                        }}
                      >
                        Start Voting
                      </Button>
                    )}
                  </HStack>

                  <Stack mt={4} spacing={1} fontSize="xs" color="text.muted">
                    <Text>Author: {proposal.authorAlias}</Text>
                    <Text>CID: {proposal.cid}</Text>
                    <Text>Flow Tx: {proposal.flowHash}</Text>
                  </Stack>
                </MotionBox>
              );
            })
          )}
        </Stack>
      </Grid>
    </Box>
  );
}
