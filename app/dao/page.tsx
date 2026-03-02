import { DAOTokenDisplay } from '@/components/dao/dao-token-display';
import { Box, Container, VStack, Text, Grid } from '@chakra-ui/react';

export default function DAOPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="3xl" fontWeight="700" color="white" mb={2}>
            DAO Governance
          </Text>
          <Text color="gray.400">
            Participate in decentralized governance with NDAO tokens.
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <DAOTokenDisplay />
          
          <Box
            bg="rgba(0, 135, 81, 0.05)"
            border="1px solid rgba(0, 135, 81, 0.2)"
            borderRadius="lg"
            p={6}
          >
            <Text fontSize="lg" fontWeight="600" color="#00EF8B" mb={4}>
              How to Earn NDAO Tokens
            </Text>
            <VStack align="stretch" spacing={3}>
              <Box>
                <Text color="white" fontWeight="500">✓ Create Proposals</Text>
                <Text color="gray.400" fontSize="sm">Earn 10 NDAO per proposal</Text>
              </Box>
              <Box>
                <Text color="white" fontWeight="500">✓ Vote on Proposals</Text>
                <Text color="gray.400" fontSize="sm">Earn 2 NDAO per vote</Text>
              </Box>
              <Box>
                <Text color="white" fontWeight="500">✓ Post Opinions</Text>
                <Text color="gray.400" fontSize="sm">Earn 1 NDAO per opinion</Text>
              </Box>
              <Box>
                <Text color="white" fontWeight="500">✓ Engage in Discussions</Text>
                <Text color="gray.400" fontSize="sm">Earn tokens for quality contributions</Text>
              </Box>
            </VStack>
          </Box>
        </Grid>
      </VStack>
    </Container>
  );
}
