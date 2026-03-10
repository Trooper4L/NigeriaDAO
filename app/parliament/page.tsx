"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Box, Button, FormControl, FormLabel, Grid, Heading,
  HStack, Icon, Input, Select, Stack, Text, Textarea, useToast,
} from "@chakra-ui/react";
import { ProposalFeed } from "@/components/parliament/proposal-feed";
import { ProposalService } from "@/lib/services/proposal";
import { FlowService } from "@/lib/services/flow";
import { api } from "@/lib/api/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useFlow } from "@/lib/hooks/useFlow";

const NIGERIAN_STATES = [
  "FCT", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
  "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function ParliamentPage() {
  const toast = useToast();
  const { user, isAuthenticated, signInAnonymous } = useAuth();
  const { isConnected } = useFlow();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    state: "FCT",
    category: "",
  });

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.summary.trim() || !form.description.trim()) {
      toast({ status: "error", description: "Title, summary and description are required." });
      return;
    }

    if (!isAuthenticated) {
      try { await signInAnonymous(); } catch {
        toast({ status: "error", description: "Authentication failed. Please try again." });
        return;
      }
    }

    setLoading(true);
    try {
      const proposal = await ProposalService.createProposal(
        form.title,
        form.summary,
        form.description,
        user?.uid || "anonymous",
        form.category,
        form.state,
      );
      toast({ status: "success", description: "Proposal submitted and open for voting." });

      if (isConnected) {
        try {
          const flowTxId = await FlowService.storeProposalHash(
            proposal.cid || '',
            proposal.title,
            JSON.stringify({ author: user?.uid, category: form.category, region: form.state })
          );
          await FlowService.mintCivicNFT(user?.uid || '', 'governance');
          toast({ title: '+25 NDAO • Governance Badge', description: 'Governance contributor badge minted on Flow', status: 'info', duration: 4000 });
          if (flowTxId && proposal.firestoreId) {
            api.patch(`/api/proposals/${proposal.firestoreId}/flowHash`, { flowHash: flowTxId }).catch(() => {});
          }
        } catch (_) {}
      }

      api.post('/api/resolve', {}).catch(() => {});
      setForm({ title: "", summary: "", description: "", state: "FCT", category: "" });
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      toast({ status: "error", description: e.message || "Failed to create proposal." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Grid templateColumns={{ base: "1fr", xl: "1.1fr 1.4fr" }} gap={6}>
        <Box
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
            Proposals start in Draft and move through public discussion and voting.
          </Text>

          <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Title</FormLabel>
              <Input
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                bg="rgba(11,14,17,0.8)"
                border="1px solid rgba(0,239,139,0.2)"
                color="white"
                _focus={{ borderColor: "#00EF8B", boxShadow: "0 0 0 1px #00EF8B" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Summary</FormLabel>
              <Textarea
                rows={2}
                value={form.summary}
                onChange={(e) => setForm((s) => ({ ...s, summary: e.target.value }))}
                bg="rgba(11,14,17,0.8)"
                border="1px solid rgba(0,239,139,0.2)"
                color="white"
                _focus={{ borderColor: "#00EF8B", boxShadow: "0 0 0 1px #00EF8B" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Description</FormLabel>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                bg="rgba(11,14,17,0.8)"
                border="1px solid rgba(0,239,139,0.2)"
                color="white"
                _focus={{ borderColor: "#00EF8B", boxShadow: "0 0 0 1px #00EF8B" }}
              />
            </FormControl>

            <Grid templateColumns="1fr 1fr" gap={3}>
              <FormControl>
                <FormLabel fontSize="sm">State</FormLabel>
                <Select
                  value={form.state}
                  onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))}
                  bg="rgba(11,14,17,0.8)"
                  border="1px solid rgba(0,239,139,0.2)"
                  color="white"
                  _focus={{ borderColor: "#00EF8B" }}
                >
                  {NIGERIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Category</FormLabel>
                <Select
                  value={form.category}
                  onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
                  bg="rgba(11,14,17,0.8)"
                  border="1px solid rgba(0,239,139,0.2)"
                  color="white"
                  _focus={{ borderColor: "#00EF8B" }}
                >
                  <option value="">Select Category</option>
                  {["Education","Healthcare","Infrastructure","Economy","Security",
                    "Environment","Technology","Governance","Social Welfare"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Button
              bg="#008751"
              color="white"
              _hover={{ bg: "#006d40" }}
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Submitting..."
            >
              Submit Proposal
            </Button>
          </Stack>
        </Box>

        <Stack spacing={4}>
          <Heading size="md">Proposal Feed</Heading>
          <ProposalFeed key={refreshKey} />
        </Stack>
      </Grid>
    </Box>
  );
}
