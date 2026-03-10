'use client';

import { useState } from 'react';
import { Button, HStack, useToast } from '@chakra-ui/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ProposalService } from '@/lib/services/proposal';
import { FlowService } from '@/lib/services/flow';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFlow } from '@/lib/hooks/useFlow';

interface VoteButtonProps {
  proposalId: string;
  proposalFirestoreId?: string;
  onVoteSuccess?: () => void;
}

export function VoteButton({ proposalId, proposalFirestoreId, onVoteSuccess }: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false);
  const { user, isAuthenticated, signInAnonymous } = useAuth();
  const { isConnected, connect } = useFlow();
  const toast = useToast();

  const handleVote = async (choice: 'support' | 'against') => {
    if (!isAuthenticated) {
      try {
        await signInAnonymous();
      } catch (error) {
        toast({ title: 'Authentication failed', description: 'Please try again', status: 'error', duration: 3000 });
        return;
      }
    }

    if (!isConnected) {
      toast({ title: 'Flow wallet required', description: 'Please connect your Flow wallet before voting', status: 'warning', duration: 4000 });
      try { await connect(); } catch { return; }
      if (!isConnected) return;
    }

    setIsVoting(true);

    try {
      const voteResult = await ProposalService.castVote(proposalId, choice, user?.uid || 'anonymous');

      toast({ title: 'Vote recorded', description: `Your ${choice} vote has been submitted`, status: 'success', duration: 3000 });

      try {
        const voteTxId = await FlowService.castVote(proposalId, choice);
        if (voteTxId) {
          if (voteResult?.firestoreId) {
            api.patch(`/api/votes/${voteResult.firestoreId}/flowHash`, { flowHash: voteTxId }).catch(() => {});
          }
          if (proposalFirestoreId) {
            api.patch(`/api/proposals/${proposalFirestoreId}/flowHash`, { flowHash: voteTxId }).catch(() => {});
          }
        }
      } catch (flowErr) {
        console.warn('Flow castVote failed:', flowErr);
      }

      try {
        await FlowService.setupNDAOVault();
        await FlowService.setupCivicNFTCollection();
        await FlowService.claimNDAOTokens(10);
        await FlowService.mintCivicNFT(user?.uid || '', 'participation');
        toast({ title: '+10 NDAO earned • Participation Badge minted', description: 'Check your Flow wallet', status: 'info', duration: 4000 });
      } catch (mintErr) {
        console.warn('Flow mint failed:', mintErr);
      }

      api.post<{ resolved: { id: string; newStatus: string; author?: string }[] }>('/api/resolve', {})
        .then(async ({ resolved }) => {
          for (const r of resolved) {
            if (r.newStatus === 'Accepted' && r.author) {
              FlowService.mintCivicNFT(r.author, 'contribution').catch(() => {});
            }
          }
        })
        .catch(() => {});

      if (onVoteSuccess) onVoteSuccess();

    } catch (error) {
      toast({ title: 'Vote failed', description: error instanceof Error ? error.message : 'Unknown error', status: 'error', duration: 5000 });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <HStack spacing={3}>
      <Button
        leftIcon={<ThumbsUp size={16} />}
        bg="rgba(0, 239, 139, 0.1)"
        color="#00EF8B"
        border="1px solid rgba(0, 239, 139, 0.3)"
        _hover={{ bg: 'rgba(0, 239, 139, 0.2)' }}
        onClick={() => handleVote('support')}
        isLoading={isVoting}
        size="sm"
      >
        Support
      </Button>

      <Button
        leftIcon={<ThumbsDown size={16} />}
        bg="rgba(255, 0, 0, 0.1)"
        color="red.400"
        border="1px solid rgba(255, 0, 0, 0.3)"
        _hover={{ bg: 'rgba(255, 0, 0, 0.2)' }}
        onClick={() => handleVote('against')}
        isLoading={isVoting}
        size="sm"
      >
        Against
      </Button>
    </HStack>
  );
}
