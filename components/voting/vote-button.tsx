'use client';

import { useState } from 'react';
import { Button, HStack, useToast } from '@chakra-ui/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ProposalService } from '@/lib/services/proposal';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFlow } from '@/lib/hooks/useFlow';

interface VoteButtonProps {
  proposalId: string;
  onVoteSuccess?: () => void;
}

export function VoteButton({ proposalId, onVoteSuccess }: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false);
  const { user, isAuthenticated, signInAnonymous } = useAuth();
  const { isConnected, connect } = useFlow();
  const toast = useToast();

  const handleVote = async (choice: 'support' | 'against') => {
    if (!isAuthenticated) {
      try {
        await signInAnonymous();
      } catch (error) {
        toast({
          title: 'Authentication failed',
          description: 'Please try again',
          status: 'error',
          duration: 3000,
        });
        return;
      }
    }

    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast({
          title: 'Flow wallet connection failed',
          description: 'Please connect your Flow wallet to vote',
          status: 'error',
          duration: 3000,
        });
        return;
      }
    }

    setIsVoting(true);

    try {
      await ProposalService.castVote(proposalId, choice, user?.uid || 'anonymous');

      toast({
        title: 'Vote recorded',
        description: `Your ${choice} vote has been recorded on Flow blockchain`,
        status: 'success',
        duration: 5000,
      });

      if (onVoteSuccess) {
        onVoteSuccess();
      }
    } catch (error) {
      toast({
        title: 'Vote failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
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
