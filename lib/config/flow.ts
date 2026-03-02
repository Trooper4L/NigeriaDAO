import * as fcl from '@onflow/fcl';

fcl.config({
  'accessNode.api': process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org',
  'discovery.wallet': process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY || 'https://fcl-discovery.onflow.org/testnet/authn',
  'app.detail.title': 'Nigeria DAO Parliament',
  'app.detail.icon': 'https://nigeriadao.org/icon.png',
  'flow.network': process.env.NEXT_PUBLIC_FLOW_NETWORK || 'testnet',
});

export { fcl };
