import { Synapse, TOKENS, formatUnits, parseUnits } from '@filoz/synapse-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

// Parse .env manually
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^"|"$/g, '')];
    })
);

const rawKey = env.FILECOIN_EVM_PRIVATE_KEY;
if (!rawKey) {
  console.error('FILECOIN_EVM_PRIVATE_KEY not found in .env');
  process.exit(1);
}
const privateKey = rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
const account = privateKeyToAccount(privateKey);
console.log(`Wallet: ${account.address}`);

const synapse = Synapse.create({ account });

// 1. Check balances
const walletBalance = await synapse.payments.walletBalance({ token: TOKENS.USDFC });
const depositedBalance = await synapse.payments.balance({ token: TOKENS.USDFC });
console.log(`\nWallet USDFC balance:    ${formatUnits(walletBalance)} USDFC`);
console.log(`Deposited USDFC balance: ${formatUnits(depositedBalance)} USDFC`);

if (walletBalance === 0n) {
  console.error('No USDFC balance. Get test tokens from https://docs.filecoin.cloud/getting-started/');
  process.exit(1);
}

// 2. Check if already approved
const approval = await synapse.payments.serviceApproval({ token: TOKENS.USDFC });
const alreadyApproved = approval && BigInt(approval.rateAllowance ?? 0n) > 0n;

if (alreadyApproved) {
  console.log('\n✅ Service already approved — no setup needed.');
  console.log(`   Rate allowance:   ${formatUnits(BigInt(approval.rateAllowance))} USDFC/epoch`);
  console.log(`   Lockup allowance: ${formatUnits(BigInt(approval.lockupAllowance))} USDFC`);
  process.exit(0);
}

// 3. Deposit + approve in one tx
const depositAmount = parseUnits('2.5');
if (walletBalance < depositAmount) {
  console.error(`Insufficient USDFC. Need 2.5, have ${formatUnits(walletBalance)}`);
  process.exit(1);
}

console.log('\nDepositing 2.5 USDFC and approving Warm Storage service...');
const hash = await synapse.payments.depositWithPermitAndApproveOperator({ amount: depositAmount });
console.log(`Tx submitted: ${hash}`);
console.log('Waiting for confirmation...');
await synapse.client.waitForTransactionReceipt({ hash });
console.log('\n✅ Setup complete! Your wallet is ready for Synapse uploads.');
