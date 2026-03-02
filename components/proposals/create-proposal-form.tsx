'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
  Select,
  useToast,
} from '@chakra-ui/react';
import { FileText } from 'lucide-react';
import { ProposalService } from '@/lib/services/proposal';
import { useAuth } from '@/lib/hooks/useAuth';

const CATEGORIES = [
  'Education',
  'Healthcare',
  'Infrastructure',
  'Economy',
  'Security',
  'Environment',
  'Technology',
  'Governance',
  'Social Welfare',
];

const STATES = [
  'National',
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export function CreateProposalForm() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('National');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, signInAnonymous } = useAuth();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!title.trim() || !summary.trim() || !description.trim()) {
      toast({
        title: 'All fields required',
        description: 'Please fill in all proposal details',
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
      await ProposalService.createProposal(
        title,
        summary,
        description,
        user?.uid || 'anonymous',
        category,
        region
      );

      toast({
        title: 'Proposal created',
        description: 'Your proposal has been stored on IPFS and Flow blockchain',
        status: 'success',
        duration: 5000,
      });

      setTitle('');
      setSummary('');
      setDescription('');
      setCategory('');
      setRegion('National');
    } catch (error) {
      toast({
        title: 'Failed to create proposal',
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
          <FileText size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Create Civic Proposal
        </Text>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Proposal Title"
          bg="rgba(11, 14, 17, 0.8)"
          border="1px solid rgba(0, 239, 139, 0.2)"
          color="white"
          _focus={{
            borderColor: '#00EF8B',
            boxShadow: '0 0 0 1px #00EF8B',
          }}
        />

        <Textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief Summary (1-2 sentences)"
          bg="rgba(11, 14, 17, 0.8)"
          border="1px solid rgba(0, 239, 139, 0.2)"
          color="white"
          minH="80px"
          _focus={{
            borderColor: '#00EF8B',
            boxShadow: '0 0 0 1px #00EF8B',
          }}
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed Description"
          bg="rgba(11, 14, 17, 0.8)"
          border="1px solid rgba(0, 239, 139, 0.2)"
          color="white"
          minH="150px"
          _focus={{
            borderColor: '#00EF8B',
            boxShadow: '0 0 0 1px #00EF8B',
          }}
        />

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Select Category"
          bg="rgba(11, 14, 17, 0.8)"
          border="1px solid rgba(0, 239, 139, 0.2)"
          color="white"
          _focus={{
            borderColor: '#00EF8B',
            boxShadow: '0 0 0 1px #00EF8B',
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          bg="rgba(11, 14, 17, 0.8)"
          border="1px solid rgba(0, 239, 139, 0.2)"
          color="white"
          _focus={{
            borderColor: '#00EF8B',
            boxShadow: '0 0 0 1px #00EF8B',
          }}
        >
          {STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>

        <Button
          bg="#008751"
          color="white"
          _hover={{ bg: '#006d40' }}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Creating proposal..."
        >
          Submit Proposal
        </Button>
      </VStack>
    </Box>
  );
}
