'use client';

import { useState } from 'react';
import { Box, Button, Textarea, VStack, HStack, Text, useToast } from '@chakra-ui/react';
import { Upload, Send } from 'lucide-react';
import { OpinionService } from '@/lib/services/opinion';
import { FlowService } from '@/lib/services/flow';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFlow } from '@/lib/hooks/useFlow';

interface OpinionFormProps {
  onPosted?: () => void;
}

export function OpinionForm({ onPosted }: OpinionFormProps = {}) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, signInAnonymous } = useAuth();
  const { isConnected } = useFlow();
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (filesToUpload: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of filesToUpload) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
      );
      const result = await api.post<{ url: string }>('/api/storage/upload-image', {
        data: base64,
        mimeType: file.type,
      });
      urls.push(result.url);
    }
    return urls;
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
      let mediaUrls: string[] = [];
      if (files.length > 0) {
        toast({ title: 'Uploading media...', status: 'info', duration: 2000 });
        mediaUrls = await uploadFiles(files);
      }

      const opinion = await OpinionService.createOpinion(
        content,
        user?.uid || 'anonymous',
        mediaUrls.length > 0 ? mediaUrls : undefined
      );

      toast({
        title: 'Opinion posted',
        description: 'Stored on Filecoin IPFS',
        status: 'success',
        duration: 3000,
      });

      if (isConnected && opinion?.cid) {
        try {
          const flowTxId = await FlowService.storeOpinionHash(
            opinion.cid,
            JSON.stringify({ author: user?.uid, content: content.slice(0, 100) })
          );
          if (flowTxId && opinion.firestoreId) {
            api.patch(`/api/opinions/${opinion.firestoreId}/flowHash`, { flowHash: flowTxId }).catch(() => {});
          }
        } catch (flowErr) {
          console.warn('Flow storeOpinionHash failed:', flowErr);
        }
        try {
          await FlowService.setupNDAOVault();
          await FlowService.claimNDAOTokens(5);
          toast({
            title: '+5 NDAO earned',
            description: 'Tokens deposited to your Flow wallet',
            status: 'info',
            duration: 4000,
          });
        } catch (mintErr) {
          console.warn('Flow mint NDAO failed:', mintErr);
        }
      } else if (!isConnected) {
        toast({ title: 'Flow wallet not connected', description: 'Connect your Flow wallet to earn NDAO tokens', status: 'warning', duration: 4000 });
      }

      setContent('');
      setFiles([]);
      onPosted?.();
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
