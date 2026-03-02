import { OpinionForm } from '@/components/opinions/opinion-form';
import { Box, Container, VStack, Text } from '@chakra-ui/react';

export default function OpinionsPage() {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="3xl" fontWeight="700" color="white" mb={2}>
            Share Your Opinion
          </Text>
          <Text color="gray.400">
            Post your thoughts anonymously. Stored on IPFS, verified on Flow blockchain.
          </Text>
        </Box>

        <OpinionForm />
      </VStack>
    </Container>
  );
}
