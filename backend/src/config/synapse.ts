import { Synapse } from '@filoz/synapse-sdk';
import { privateKeyToAccount } from 'viem/accounts';

let _synapse: Synapse | null = null;
let _initPromise: Promise<Synapse> | null = null;

async function initSynapse(): Promise<Synapse> {
  const rawKey = process.env.FILECOIN_EVM_PRIVATE_KEY;
  if (!rawKey) throw new Error('FILECOIN_EVM_PRIVATE_KEY is not set');
  const privateKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const instance = Synapse.create({ account });
  console.log(`[Synapse] Initialized for ${account.address}`);
  return instance;
}

export async function getSynapse(): Promise<Synapse> {
  if (_synapse) return _synapse;
  if (!_initPromise) _initPromise = initSynapse();
  _synapse = await _initPromise;
  return _synapse;
}

export function resetSynapse(): void {
  _synapse = null;
  _initPromise = null;
}
