'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box, VStack, HStack, Text, Badge, Spinner, Select, IconButton, Tooltip,
} from '@chakra-ui/react';
import { ExternalLink, Twitter } from 'lucide-react';
import { ProposalService } from '@/lib/services/proposal';
import { VoteButton } from '@/components/voting/vote-button';
import { Proposal } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  Draft: 'gray',
  'Public Discussion': 'blue',
  Voting: 'green',
  Accepted: 'teal',
  Rejected: 'red',
};

export function ProposalFeed() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    ProposalService.getProposals()
      .then((data) => { if (isMounted.current) setProposals(data); })
      .catch((e) => console.error('Failed to fetch proposals', e))
      .finally(() => { if (isMounted.current) setLoading(false); });
    return () => { isMounted.current = false; };
  }, []);

  const fetchProposals = () => {
    ProposalService.getProposals()
      .then((data) => setProposals(data))
      .catch((e) => console.error('Failed to fetch proposals', e));
  };

  const filtered = filter === 'All'
    ? proposals
    : proposals.filter((p) => p.status === filter);

  if (loading) {
    return (
      <HStack justify="center" py={12}>
        <Spinner color="#00EF8B" />
        <Text color="gray.500">Loading proposals...</Text>
      </HStack>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="flex-end">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          bg="rgba(11,14,17,0.8)"
          border="1px solid rgba(0,239,139,0.2)"
          color="white"
          w="200px"
          size="sm"
          borderRadius="md"
        >
          {['All', 'Draft', 'Public Discussion', 'Voting', 'Accepted', 'Rejected'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </HStack>

      {filtered.length === 0 ? (
        <Box
          textAlign="center"
          py={12}
          border="1px dashed rgba(255,255,255,0.1)"
          borderRadius="lg"
        >
          <Text color="gray.500">No proposals found.</Text>
        </Box>
      ) : (
        filtered.map((proposal) => (
          <Box
            key={proposal.firestoreId || proposal.id}
            bg="rgba(11, 14, 17, 0.6)"
            border="1px solid rgba(0, 239, 139, 0.15)"
            borderRadius="lg"
            p={5}
            _hover={{ borderColor: 'rgba(0, 239, 139, 0.3)' }}
          >
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between" align="flex-start">
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="xs" color="gray.500" fontFamily="mono">{proposal.id}</Text>
                  <Text fontWeight="600" color="white" fontSize="md">{proposal.title}</Text>
                </VStack>
                <Badge colorScheme={STATUS_COLORS[proposal.status] || 'gray'} flexShrink={0}>
                  {proposal.status}
                </Badge>
              </HStack>

              <Text color="gray.300" fontSize="sm">{proposal.summary}</Text>

              {(proposal.category || proposal.region) && (
                <HStack spacing={2} flexWrap="wrap">
                  {proposal.category && (
                    <Badge bg="rgba(0,135,81,0.2)" color="#00EF8B" fontSize="xs">{proposal.category}</Badge>
                  )}
                  {proposal.region && (
                    <Badge bg="rgba(0,100,255,0.15)" color="blue.300" fontSize="xs">{proposal.region}</Badge>
                  )}
                </HStack>
              )}

              <Box>
                <HStack justify="space-between" fontSize="xs" color="gray.500" mb={1}>
                  <Text>Support: {proposal.support}</Text>
                  <Text>Against: {proposal.against}</Text>
                </HStack>
                <Box h={1.5} borderRadius="full" bg="whiteAlpha.200" overflow="hidden">
                  <Box
                    h="full"
                    bg="#00EF8B"
                    w={`${proposal.support + proposal.against > 0
                      ? Math.round((proposal.support / (proposal.support + proposal.against)) * 100)
                      : 0}%`}
                    transition="width 0.3s ease"
                  />
                </Box>
              </Box>

              {proposal.status === 'Voting' && (
                <VoteButton
                  proposalId={proposal.firestoreId || proposal.id}
                  proposalFirestoreId={proposal.firestoreId}
                  onVoteSuccess={fetchProposals}
                />
              )}

              <HStack justify="space-between" pt={1}>
                <Text fontSize="xs" color="gray.600">
                  {new Date(proposal.createdAt).toLocaleDateString('en-NG', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </Text>
                <HStack spacing={2}>
                  {proposal.cid && (
                    <HStack spacing={1}>
                      <Text fontSize="xs" color="gray.600" fontFamily="mono">
                        {proposal.cid.slice(0, 12)}…
                      </Text>
                      <Box
                        as="a"
                        href={`https://calibration.filscan.io/tipset/message-detail?cid=${proposal.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="gray.500"
                        _hover={{ color: '#00EF8B' }}
                      >
                        <ExternalLink size={12} />
                      </Box>
                    </HStack>
                  )}
                  <Tooltip label="Share to X" placement="top" hasArrow>
                    <IconButton
                      aria-label="Share to X"
                      icon={<Twitter size={13} />}
                      size="xs"
                      variant="ghost"
                      color="gray.500"
                      _hover={{ color: '#1DA1F2', bg: 'rgba(29,161,242,0.1)' }}
                      as="a"
                      href={(() => {
                        const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/parliament`;
                        const text = `📜 Civic Proposal: ${proposal.title}\n\n${proposal.summary?.slice(0, 120)}${proposal.summary?.length > 120 ? '…' : ''}\n\nStatus: ${proposal.status} | ${proposal.support} support · ${proposal.against} against\n\n🗳️ Vote here: ${link}\n\n#NaijaDAO #Nigeria #CivicTech`;
                        return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
                      })()}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        ))
      )}
    </VStack>
  );
}
