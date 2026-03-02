'use client';

import { Box, Text, HStack, VStack, IconButton, Badge } from '@chakra-ui/react';
import { ThumbsUp, ThumbsDown, MessageCircle, ExternalLink } from 'lucide-react';
import { Opinion } from '@/lib/types';

interface OpinionCardProps {
  opinion: Opinion;
}

export function OpinionCard({ opinion }: OpinionCardProps) {
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
          <HStack spacing={2} flexWrap="wrap">
            {opinion.mediaUrls.map((url, idx) => (
              <Badge
                key={idx}
                variant="outline"
                colorScheme="blue"
                fontSize="xs"
              >
                Media {idx + 1}
              </Badge>
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
                color="gray.400"
                _hover={{ color: '#00EF8B', bg: 'rgba(0, 239, 139, 0.1)' }}
              />
              <Text fontSize="sm" color="gray.400">
                {opinion.upvotes}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <IconButton
                aria-label="Downvote"
                icon={<ThumbsDown size={16} />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'red.400', bg: 'rgba(255, 0, 0, 0.1)' }}
              />
              <Text fontSize="sm" color="gray.400">
                {opinion.downvotes}
              </Text>
            </HStack>

            <HStack spacing={1}>
              <IconButton
                aria-label="Comments"
                icon={<MessageCircle size={16} />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'blue.400', bg: 'rgba(0, 100, 255, 0.1)' }}
              />
              <Text fontSize="sm" color="gray.400">
                {opinion.comments}
              </Text>
            </HStack>
          </HStack>

          <HStack spacing={2}>
            <IconButton
              aria-label="View on IPFS"
              icon={<ExternalLink size={14} />}
              size="xs"
              variant="ghost"
              color="gray.500"
              as="a"
              href={`https://gateway.lighthouse.storage/ipfs/${opinion.cid}`}
              target="_blank"
              _hover={{ color: '#00EF8B' }}
            />
            <Text fontSize="xs" color="gray.600" fontFamily="mono">
              {opinion.flowHash.slice(0, 10)}...
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}
