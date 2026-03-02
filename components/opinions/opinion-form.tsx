'use client';

import { useState } from 'react';
import { Box, Button, Textarea, VStack, HStack, Text, useToast } from '@chakra-ui/react';
import { Upload, Send } from 'lucide-react';
import { OpinionService } from '@/lib/services/opinion';
import { useAuth } from '@/lib/hooks/useAuth';

export function OpinionForm() {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, signInAnonymous } = useAuth();
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter your opinion',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

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

    setIsSubmitting(true);

    try {
      await OpinionService.createOpinion(
        content,
        user?.uid || 'anonymous',
        files.length > 0 ? files : undefined
      );

      toast({
        title: 'Opinion posted',
        description: 'Your opinion has been stored on IPFS and Flow blockchain',
        status: 'success',
        duration: 5000,
      });

      setContent('');
      setFiles([]);
    } catch (error) {
      toast({
        title: 'Failed to post opinion',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      bg="rgba(0, 135, 81, 0.05)"
      border="1px solid rgba(0, 135, 81, 0.2)"
      borderRadius="lg"
      p={6}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="600" color="#00EF8B">
          Share Your Opinion
        </Text>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind about Nigeria?"
          bg="rgba(11, 14, 17, 0.8)"
          border="1px solid rgba(0, 239, 139, 0.2)"
          color="white"
          minH="120px"
          _focus={{
            borderColor: '#00EF8B',
            boxShadow: '0 0 0 1px #00EF8B',
          }}
        />

        <HStack spacing={4}>
          <Button
            as="label"
            leftIcon={<Upload size={18} />}
            variant="outline"
            borderColor="rgba(0, 239, 139, 0.3)"
            color="#00EF8B"
            _hover={{ bg: 'rgba(0, 239, 139, 0.1)' }}
            cursor="pointer"
          >
            Upload Media
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>

          {files.length > 0 && (
            <Text fontSize="sm" color="gray.400">
              {files.length} file(s) selected
            </Text>
          )}
        </HStack>

        <Button
          leftIcon={<Send size={18} />}
          bg="#008751"
          color="white"
          _hover={{ bg: '#006d40' }}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Posting to IPFS & Flow..."
        >
          Post Opinion
        </Button>
      </VStack>
    </Box>
  );
}
