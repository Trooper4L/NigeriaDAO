"use client";

import { FormEvent, useMemo, useState } from "react";
import { AlertTriangle, Check, MessageSquarePlus, Share2 } from "lucide-react";
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
  Link,
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

function opinionShareLinks(text: string) {
  const encoded = encodeURIComponent(text);
  return {
    x: `https://x.com/intent/tweet?text=${encoded}`,
    telegram: `https://t.me/share/url?url=https://nigeria-dao.local&text=${encoded}`,
    whatsapp: `https://wa.me/?text=${encoded}`
  };
}

export default function OpinionsPage() {
  const toast = useToast();
  const { store, createOpinion, moderateOpinion } = useCivic();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    body: "",
    mediaUrl: "",
    state: "FCT",
    tags: ""
  });

  const opinions = useMemo(
    () => [...store.opinions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [store.opinions]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.body.trim()) {
      toast({ status: "error", description: "Opinion text is required." });
      return;
    }

    setLoading(true);
    await createOpinion({
      body: form.body,
      mediaUrl: form.mediaUrl || undefined,
      state: form.state,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    });
    setLoading(false);
    setForm({ body: "", mediaUrl: "", state: "FCT", tags: "" });
    toast({ status: "success", description: "Opinion published successfully." });
  };

  return (
    <Box py={{ base: 2, md: 4 }}>
      <Grid templateColumns={{ base: "1fr", xl: "1.1fr 1.3fr" }} gap={6}>
        <MotionBox
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          p={5}
          rounded="xl"
          border="1px solid"
          borderColor="whiteAlpha.300"
          bg="rgba(14,21,32,0.8)"
          h="fit-content"
        >
          <HStack mb={3} spacing={2}>
            <Icon as={MessageSquarePlus} boxSize={5} color="flow.500" />
            <Heading size="md">Post Opinion</Heading>
          </HStack>
          <Box as="form" onSubmit={onSubmit}>
            <Stack spacing={3}>
            <FormControl isRequired>
              <FormLabel>Opinion</FormLabel>
              <Textarea value={form.body} rows={5} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} />
            </FormControl>
            <FormControl>
              <FormLabel>Media URL (optional)</FormLabel>
              <Input value={form.mediaUrl} onChange={(e) => setForm((s) => ({ ...s, mediaUrl: e.target.value }))} />
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
              <FormControl>
                <FormLabel>Tags (comma separated)</FormLabel>
                <Input value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
              </FormControl>
            </Grid>
            <Button type="submit" isLoading={loading}>
              Publish Opinion
            </Button>
            </Stack>
          </Box>
        </MotionBox>

        <Stack spacing={4}>
          <Heading size="md">Public Opinion Stream</Heading>
          {opinions.length === 0 ? (
            <Box p={6} rounded="xl" border="1px dashed" borderColor="whiteAlpha.300">
              <Text color="text.muted">No opinions have been published yet.</Text>
            </Box>
          ) : (
            opinions.map((opinion, index) => {
              const links = opinionShareLinks(opinion.body);
              const flagged = opinion.moderationStatus === "flagged";
              return (
                <MotionBox
                  key={opinion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  p={4}
                  rounded="xl"
                  border="1px solid"
                  borderColor={flagged ? "red.400" : "whiteAlpha.300"}
                  bg="rgba(12,18,28,0.82)"
                >
                  <HStack justify="space-between" align="start">
                    <Stack spacing={0.5}>
                      <Text fontSize="sm" fontWeight="semibold">
                        {opinion.authorAlias}
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        {new Date(opinion.createdAt).toLocaleString()}
                      </Text>
                    </Stack>
                    <Badge colorScheme={flagged ? "red" : "green"}>{opinion.moderationStatus}</Badge>
                  </HStack>

                  <Text mt={3} fontSize="sm">
                    {opinion.body}
                  </Text>

                  <HStack spacing={2} mt={3} flexWrap="wrap">
                    <Tag colorScheme="green">{opinion.state}</Tag>
                    {opinion.tags.map((tag) => (
                      <Tag key={`${opinion.id}_${tag}`} colorScheme="gray">
                        {tag}
                      </Tag>
                    ))}
                    <Tag colorScheme={opinion.sentimentScore >= 0 ? "teal" : "orange"}>
                      Sentiment {opinion.sentimentScore}
                    </Tag>
                  </HStack>

                  {opinion.mediaUrl ? (
                    <Link href={opinion.mediaUrl} mt={3} display="inline-block" color="flow.500" isExternal>
                      Open media
                    </Link>
                  ) : null}

                  <HStack mt={4} spacing={2} flexWrap="wrap">
                    <Button
                      as="a"
                      href={links.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="xs"
                      leftIcon={<Share2 size={12} />}
                    >
                      Share to X
                    </Button>
                    <Button
                      as="a"
                      href={links.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="xs"
                      variant="outline"
                    >
                      Telegram
                    </Button>
                    <Button
                      as="a"
                      href={links.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="xs"
                      variant="outline"
                    >
                      WhatsApp
                    </Button>
                    {flagged && (
                      <>
                        <Button size="xs" colorScheme="green" leftIcon={<Check size={12} />} onClick={() => moderateOpinion(opinion.id, "approved")}>
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          leftIcon={<AlertTriangle size={12} />}
                          onClick={() => moderateOpinion(opinion.id, "removed")}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </HStack>

                  <Stack mt={4} spacing={0.5} fontSize="xs" color="text.muted">
                    <Text>CID: {opinion.cid}</Text>
                    <Text>Flow Tx: {opinion.flowHash}</Text>
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
