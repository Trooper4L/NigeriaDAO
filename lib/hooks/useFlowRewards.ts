'use client';

import { useCallback, useRef } from 'react';
import { FlowService } from '@/lib/services/flow';
import { useFlow } from '@/lib/hooks/useFlow';

const VAULT_KEY = (addr: string) => `ndao_vault_setup_${addr}`;
const COLLECTION_KEY = (addr: string) => `ndao_collection_setup_${addr}`;

/**
 * Returns a single `grantRewards` function that:
 *  1. Sets up the NDAO vault only if not already done (tracked in localStorage)
 *  2. Sets up the CivicNFT collection only if not already done
 *  3. Claims NDAO tokens
 *  4. Mints a CivicNFT badge
 * Each step that is already done is skipped silently — so only truly new
 * transactions trigger a wallet approval popup.
 *
 * Also guards against concurrent calls with an in-flight ref.
 */
export function useFlowRewards() {
  const { address } = useFlow();
  const inFlight = useRef(false);

  const grantRewards = useCallback(
    async (ndaoAmount: number, badgeType: string, badgeRecipientUid: string) => {
      if (!address || inFlight.current) return;
      inFlight.current = true;

      try {
        const vaultKey = VAULT_KEY(address);
        const collectionKey = COLLECTION_KEY(address);

        if (!localStorage.getItem(vaultKey)) {
          await FlowService.setupNDAOVault();
          localStorage.setItem(vaultKey, '1');
        }

        if (!localStorage.getItem(collectionKey)) {
          await FlowService.setupCivicNFTCollection();
          localStorage.setItem(collectionKey, '1');
        }

        await FlowService.claimRewards(ndaoAmount, badgeType);
      } finally {
        inFlight.current = false;
      }
    },
    [address]
  );

  return { grantRewards };
}
