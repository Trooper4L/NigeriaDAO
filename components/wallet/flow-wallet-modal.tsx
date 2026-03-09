'use client';

import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, Button, VStack, Text, HStack, Badge, Box, Divider,
} from '@chakra-ui/react';
import { Wallet, ShieldCheck, Zap, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useFlow } from '@/lib/hooks/useFlow';

interface FlowWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlowWalletModal({ isOpen, onClose }: FlowWalletModalProps) {
  const { isConnected, address, connect, disconnect, loading } = useFlow();

  const handleConnect = async () => {
    await connect();
    onClose();
  };

  const handleDisconnect = async () => {
    await disconnect();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay bg="rgba(0,0,0,0.75)" backdropFilter="blur(6px)" />
      <ModalContent
        bg="rgba(11, 14, 17, 0.97)"
        border="1px solid rgba(0,239,139,0.2)"
        borderRadius="2xl"
      >
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Image src="/naijadao-logo.png" alt="NaijaDAO" width={32} height={32} style={{ borderRadius: 8 }} />
            <Text color="white" fontSize="lg" fontWeight="700">Flow Wallet</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody>
          {isConnected && address ? (
            <VStack spacing={4} align="stretch">
              <Box
                bg="rgba(0,135,81,0.1)"
                border="1px solid rgba(0,239,139,0.2)"
                borderRadius="xl"
                p={4}
              >
                <HStack justify="space-between" mb={2}>
                  <Badge bg="rgba(0,239,139,0.15)" color="#00EF8B" px={2} py={1} borderRadius="md">
                    Connected
                  </Badge>
                  <Badge bg="rgba(0,135,81,0.2)" color="green.300" px={2} py={1} borderRadius="md">
                    Flow Testnet
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.300" fontFamily="mono" mt={2}>
                  {address}
                </Text>
              </Box>

              <Divider borderColor="whiteAlpha.100" />

              <VStack align="stretch" spacing={2}>
                <HStack spacing={2} color="gray.400" fontSize="sm">
                  <ShieldCheck size={14} />
                  <Text>Transactions require your wallet approval</Text>
                </HStack>
                <HStack spacing={2} color="gray.400" fontSize="sm">
                  <Zap size={14} />
                  <Text>Votes and proposals are signed on-chain</Text>
                </HStack>
              </VStack>
            </VStack>
          ) : (
            <VStack spacing={5} align="stretch">
              <Text color="gray.300" fontSize="sm" lineHeight="1.7">
                Connect your Flow wallet to vote on proposals, register opinions on-chain,
                and participate in NaijaDAO governance. Every transaction will prompt
                your wallet for approval.
              </Text>

              <VStack align="stretch" spacing={2}>
                {[
                  { icon: <ShieldCheck size={14} />, text: 'All transactions require your signature' },
                  { icon: <Zap size={14} />, text: 'Anonymous participation guaranteed' },
                  { icon: <Wallet size={14} />, text: 'Works with Flow Wallet & Blocto' },
                ].map(({ icon, text }, i) => (
                  <HStack key={i} spacing={2} color="gray.400" fontSize="sm">
                    {icon}
                    <Text>{text}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter gap={3}>
          {isConnected ? (
            <>
              <Button variant="ghost" color="gray.400" onClick={onClose} size="sm">
                Close
              </Button>
              <Button
                leftIcon={<LogOut size={14} />}
                variant="outline"
                borderColor="red.500"
                color="red.400"
                size="sm"
                _hover={{ bg: 'rgba(255,0,0,0.1)' }}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" color="gray.400" onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button
                leftIcon={<Wallet size={16} />}
                bg="#008751"
                color="white"
                _hover={{ bg: '#006d40' }}
                onClick={handleConnect}
                isLoading={loading}
                loadingText="Connecting..."
                size="sm"
              >
                Connect Flow Wallet
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
