import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
  'discovery.wallet': process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY || 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'Nigeria DAO Parliament',
  'app.detail.icon': 'https://nigeriadao.org/icon.png',
  'app.detail.id': process.env.NEXT_PUBLIC_FLOW_APP_ID || '9bd9c657d851d3d9f9eae9641c35f804',
  'walletconnect.projectId': process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '6be4a8d0eed9cf108d15329a6e969fe9',
  'flow.network': process.env.NEXT_PUBLIC_FLOW_NETWORK || 'testnet',
});

export { fcl };
