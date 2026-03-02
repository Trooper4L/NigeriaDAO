import { ProposalFeed } from '@/components/parliament/proposal-feed';
import { CreateProposalForm } from '@/components/proposals/create-proposal-form';
import { Box, Container, VStack, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export default function ProposalsPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize="3xl" fontWeight="700" color="white" mb={2}>
            Civic Proposals
          </Text>
          <Text color="gray.400">
            Create and vote on proposals that shape Nigeria's future.
          </Text>
        </Box>

        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab _selected={{ bg: '#008751', color: 'white' }}>All Proposals</Tab>
            <Tab _selected={{ bg: '#008751', color: 'white' }}>Create Proposal</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <ProposalFeed />
            </TabPanel>
            <TabPanel px={0}>
              <CreateProposalForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
