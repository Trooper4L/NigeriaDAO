'use client';

import { useState, useCallback } from 'react';
import {
  Box, Text, HStack, VStack, IconButton, Badge, Collapse, Textarea,
  Button, useToast, Spinner, Tooltip,
} from '@chakra-ui/react';
import { ThumbsUp, ThumbsDown, MessageCircle, ExternalLink, Send, Twitter } from 'lucide-react';
import { Opinion } from '@/lib/types';
import { api } from '@/lib/api/client';

interface CommentItem {
  id: string;
  content: string;
  author: string;
  createdAt: number;
}

interface OpinionCardProps {
  opinion: Opinion;
  onCommentPosted?: () => void;
}

export function OpinionCard({ opinion, onCommentPosted }: OpinionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [upvotes, setUpvotes] = useState(opinion.upvotes);
  const [downvotes, setDownvotes] = useState(opinion.downvotes);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const toast = useToast();

  const opinionId = opinion.firestoreId || opinion.id;

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const data = await api.get<CommentItem[]>(`/api/opinions/${opinionId}/comments`);
      setComments(data);
    } catch (e: any) {
      toast({ title: 'Failed to load comments', description: e.message, status: 'error', duration: 3000 });
    } finally {
      setLoadingComments(false);
    }
  }, [opinionId, toast]);

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) {
      fetchComments();
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (voted === type) return;
    const prev = { upvotes, downvotes, voted };
    if (type === 'up') setUpvotes((v) => v + 1);
    else setDownvotes((v) => v + 1);
    if (voted) {
      if (voted === 'up') setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    }
    setVoted(type);
    try {
      await api.patch(`/api/opinions/${opinionId}/vote`, { type });
    } catch (e: any) {
      setUpvotes(prev.upvotes);
      setDownvotes(prev.downvotes);
      setVoted(prev.voted);
      toast({ title: 'Vote failed', description: e.message, status: 'error', duration: 3000 });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await api.post<CommentItem>(`/api/opinions/${opinionId}/comments`, {
        content: comment,
        author: 'anonymous',
      });
      setComment('');
      setComments((prev) => [...prev, newComment]);
      toast({ title: 'Comment posted', status: 'success', duration: 3000 });
      onCommentPosted?.();
    } catch (e: any) {
      toast({ title: 'Failed to post comment', description: e.message, status: 'error', duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      bg="rgba(11, 14, 17, 0.6)"
      border="1px solid rgba(0, 239, 139, 0.15)"
      borderRadius="lg"
      p={5}
      _hover={{
        borderColor: 'rgba(0, 239, 139, 0.3)',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s',
      }}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Badge
              bg="rgba(0, 135, 81, 0.2)"
              color="#00EF8B"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
            >
              Anonymous Citizen
            </Badge>
            {opinion.trending && (
              <Badge
                bg="rgba(255, 165, 0, 0.2)"
                color="orange.300"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="md"
              >
                🔥 Trending
              </Badge>
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {formatTimestamp(opinion.createdAt)}
          </Text>
        </HStack>

        <Text color="gray.100" fontSize="md" lineHeight="1.6">
          {opinion.content}
        </Text>

        {opinion.mediaUrls && opinion.mediaUrls.length > 0 && (
          <HStack spacing={2} flexWrap="wrap" mt={1}>
            {opinion.mediaUrls.map((url, idx) => (
              String(url).startsWith('http') ? (
                <Box
                  key={idx}
                  as="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  borderRadius="md"
                  overflow="hidden"
                  border="1px solid rgba(0,239,139,0.2)"
                  maxW="200px"
                  flexShrink={0}
                >
                  <img
                    src={url}
                    alt={`Media ${idx + 1}`}
                    style={{ display: 'block', maxWidth: '200px', maxHeight: '160px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                    }}
                  />
                </Box>
              ) : (
                <Badge key={idx} variant="outline" colorScheme="blue" fontSize="xs">
                  Media {idx + 1}
                </Badge>
              )
            ))}
          </HStack>
        )}

        <HStack justify="space-between" pt={2}>
          <HStack spacing={4}>
            <HStack spacing={1}>
              <IconButton
                aria-label="Upvote"
                icon={<ThumbsUp size={16} />}
                size="sm"
                variant="ghost"
                color={voted === 'up' ? '#00EF8B' : 'gray.400'}
                bg={voted === 'up' ? 'rgba(0, 239, 139, 0.1)' : undefined}
                _hover={{ color: '#00EF8B', bg: 'rgba(0, 239, 139, 0.1)' }}
                onClick={() => handleVote('up')}
              />
              <Text fontSize="sm" color="gray.400">
                {upvotes}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <IconButton
                aria-label="Downvote"
                icon={<ThumbsDown size={16} />}
                size="sm"
                variant="ghost"
                color={voted === 'down' ? 'red.400' : 'gray.400'}
                bg={voted === 'down' ? 'rgba(255, 0, 0, 0.1)' : undefined}
                _hover={{ color: 'red.400', bg: 'rgba(255, 0, 0, 0.1)' }}
                onClick={() => handleVote('down')}
              />
              <Text fontSize="sm" color="gray.400">
                {downvotes}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <IconButton
                aria-label="Toggle comments"
                icon={<MessageCircle size={16} />}
                size="sm"
                variant="ghost"
                color={showComments ? 'blue.400' : 'gray.400'}
                bg={showComments ? 'rgba(0,100,255,0.1)' : undefined}
                _hover={{ color: 'blue.400', bg: 'rgba(0, 100, 255, 0.1)' }}
                onClick={handleToggleComments}
              />
              <Text fontSize="sm" color="gray.400">
                {opinion.comments}
              </Text>
            </HStack>
          </HStack>

          <HStack spacing={2}>
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
                  const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/opinions`;
                  const text = `💬 Civic Opinion on NaijaDAO:\n\n"${opinion.content.slice(0, 200)}${opinion.content.length > 200 ? '…' : ''}"\n\n🗳️ Read & vote: ${link}\n\n#NaijaDAO #Nigeria #CivicTech`;
                  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
                })()}
                target="_blank"
                rel="noopener noreferrer"
              />
            </Tooltip>
            {opinion.cid && (
              <IconButton
                aria-label="View on Filecoin"
                icon={<ExternalLink size={14} />}
                size="xs"
                variant="ghost"
                color="gray.500"
                as="a"
                href={`https://calibration.filscan.io/tipset/message-detail?cid=${opinion.cid}`}
                target="_blank"
                _hover={{ color: '#00EF8B' }}
              />
            )}
            {opinion.flowHash && (
              <Text fontSize="xs" color="gray.600" fontFamily="mono">
                {opinion.flowHash.slice(0, 10)}...
              </Text>
            )}
          </HStack>
        </HStack>

        <Collapse in={showComments} animateOpacity>
          <VStack
            align="stretch"
            spacing={3}
            pt={3}
            mt={1}
            borderTop="1px solid rgba(255,255,255,0.06)"
          >
            <Text fontSize="xs" color="gray.500" fontWeight="medium" textTransform="uppercase" letterSpacing="wider">
              Anonymous Comments
            </Text>

            {loadingComments ? (
              <HStack justify="center" py={3}>
                <Spinner size="sm" color="#00EF8B" />
                <Text fontSize="xs" color="gray.500">Loading comments...</Text>
              </HStack>
            ) : comments.length > 0 ? (
              <VStack align="stretch" spacing={2}>
                {comments.map((c) => (
                  <Box
                    key={c.id}
                    bg="rgba(255,255,255,0.03)"
                    border="1px solid rgba(255,255,255,0.06)"
                    borderRadius="md"
                    px={3}
                    py={2}
                  >
                    <Text fontSize="xs" color="gray.100" mb={1}>{c.content}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {formatTimestamp(c.createdAt)}
                    </Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text fontSize="xs" color="gray.600">No comments yet.</Text>
            )}

            <HStack align="flex-end" spacing={2}>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Reply anonymously..."
                bg="rgba(11,14,17,0.8)"
                border="1px solid rgba(0,239,139,0.15)"
                color="white"
                fontSize="sm"
                minH="70px"
                resize="none"
                _focus={{ borderColor: '#00EF8B', boxShadow: '0 0 0 1px #00EF8B' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleComment();
                }}
              />
              <IconButton
                aria-label="Post comment"
                icon={<Send size={16} />}
                size="sm"
                bg="#008751"
                color="white"
                _hover={{ bg: '#006d40' }}
                onClick={handleComment}
                isLoading={submitting}
              />
            </HStack>
            <Text fontSize="xs" color="gray.600">Press Ctrl+Enter to submit</Text>
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
}
