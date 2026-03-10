import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': process.env.FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
  'flow.network': process.env.FLOW_NETWORK || 'testnet',
  'app.detail.id': process.env.FLOW_APP_ID || '',
});

export const CONTRACT_ADDRESS = process.env.FLOW_CONTRACT_ADDRESS || '0x513ea4a723716b6f';
export { fcl };
