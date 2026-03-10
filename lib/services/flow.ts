import { fcl } from '@/lib/config/flow';

const CONTRACTS = '0x513ea4a723716b6f';

export class FlowService {
  static async authenticate(): Promise<any> {
    return await fcl.authenticate();
  }

  static async unauthenticate(): Promise<void> {
    return await fcl.unauthenticate();
  }

  static async getCurrentUser(): Promise<any> {
    return await fcl.currentUser.snapshot();
  }

  static subscribeToUser(callback: (user: any) => void) {
    return fcl.currentUser.subscribe(callback);
  }

  // ── Setup: must be called once per user before minting ────────────────────

  static async setupNDAOVault(): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import NDAOToken from ${CONTRACTS}

        transaction {
          prepare(signer: auth(Storage, Capabilities) &Account) {
            let storagePath = /storage/NDAOTokenVault
            let publicPath = /public/NDAOTokenVault
            let receiverPath = /public/NDAOTokenReceiver

            if signer.storage.borrow<&NDAOToken.Vault>(from: storagePath) == nil {
              let vault <- NDAOToken.createEmptyVault(vaultType: Type<@NDAOToken.Vault>())
              signer.storage.save(<-vault, to: storagePath)
            }
            if !signer.capabilities.get<&NDAOToken.Vault>(publicPath).check() {
              let vaultCap = signer.capabilities.storage.issue<&NDAOToken.Vault>(storagePath)
              signer.capabilities.publish(vaultCap, at: publicPath)
            }
            if !signer.capabilities.get<&{FungibleToken.Receiver}>(receiverPath).check() {
              let receiverCap = signer.capabilities.storage.issue<&{FungibleToken.Receiver}>(storagePath)
              signer.capabilities.publish(receiverCap, at: receiverPath)
            }
          }
        }
      `,
      args: () => [],
      limit: 200,
    });
    return txId;
  }

  static async setupCivicNFTCollection(): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import CivicNFT from ${CONTRACTS}

        transaction {
          prepare(signer: auth(Storage, Capabilities) &Account) {
            let storagePath = /storage/CivicNFTCollection
            let publicPath = /public/CivicNFTCollection
            if signer.storage.borrow<&CivicNFT.Collection>(from: storagePath) != nil {
              return
            }
            let collection <- CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
            signer.storage.save(<-collection, to: storagePath)
            let collectionCap = signer.capabilities.storage.issue<&CivicNFT.Collection>(storagePath)
            signer.capabilities.publish(collectionCap, at: publicPath)
          }
        }
      `,
      args: () => [],
      limit: 200,
    });
    return txId;
  }

  // ── Registry transactions ─────────────────────────────────────────────────

  static async storeOpinionHash(cid: string, metadata: string): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import OpinionRegistry from ${CONTRACTS}

        transaction(cid: String, metadata: String) {
          prepare(signer: auth(Storage) &Account) {
            OpinionRegistry.registerOpinion(cid: cid, metadata: metadata, author: signer.address)
          }
        }
      `,
      args: (arg: any, t: any) => [arg(cid, t.String), arg(metadata, t.String)],
      limit: 100,
    });
    return txId;
  }

  static async storeProposalHash(cid: string, title: string, metadata: string): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import ProposalRegistry from ${CONTRACTS}

        transaction(cid: String, title: String, metadata: String) {
          prepare(signer: auth(Storage) &Account) {
            ProposalRegistry.createProposal(cid: cid, title: title, metadata: metadata, author: signer.address)
          }
        }
      `,
      args: (arg: any, t: any) => [arg(cid, t.String), arg(title, t.String), arg(metadata, t.String)],
      limit: 100,
    });
    return txId;
  }

  static async castVote(proposalId: string, choice: 'support' | 'against'): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import VotingContract from ${CONTRACTS}

        transaction(proposalId: String, choice: String) {
          prepare(signer: auth(Storage) &Account) {
            VotingContract.castVote(proposalId: proposalId, choice: choice, voter: signer.address, weight: 1)
          }
        }
      `,
      args: (arg: any, t: any) => [arg(proposalId, t.String), arg(choice, t.String)],
      limit: 100,
    });
    return txId;
  }

  // ── Token & NFT minting ───────────────────────────────────────────────────

  // Claims NDAO tokens for the connected wallet (signer = recipient).
  // Vault must be set up first via setupNDAOVault().
  static async claimNDAOTokens(amount: number): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import NDAOToken from ${CONTRACTS}

        transaction(amount: UFix64) {
          prepare(signer: auth(Storage) &Account) {
            NDAOToken.claimTokens(amount: amount, recipient: signer.address)
          }
          execute {}
        }
      `,
      args: (arg: any, t: any) => [arg(amount.toFixed(1), t.UFix64)],
      limit: 200,
    });
    return txId;
  }

  // Mints a CivicNFT badge for the connected wallet (signer = recipient).
  // Collection must be set up first via setupCivicNFTCollection().
  // The "recipient" param is kept for API compat but the signer.address is used on-chain.
  static async mintCivicNFT(_recipient: string, badgeType: string): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import CivicNFT from ${CONTRACTS}

        transaction(badgeType: String) {
          prepare(signer: auth(Storage) &Account) {
            CivicNFT.claimBadge(recipient: signer.address, badgeType: badgeType)
          }
        }
      `,
      args: (arg: any, t: any) => [arg(badgeType, t.String)],
      limit: 200,
    });
    return txId;
  }

  // ── Token suggestion: prompts wallet to add NDAO ─────────────────────────

  // Calls FCL's wallet-level token suggestion so the connected wallet shows
  // a popup asking the user to add the NDAO token.
  static async suggestNDAOToken(): Promise<void> {
    // FCL 1.x exposes this via fcl.experimental.suggestFCLTokens or
    // directly as fcl.suggestFCLTokens depending on wallet version.
    // We use the standard FT metadata approach — issue a mutate tx that
    // calls setupNDAOVault (idempotent) which causes the wallet to
    // recognise the token via FTDisplay metadata on the contract.
    // Additionally trigger the wallet's native token-add flow via window.fcl.
    const suggestFn =
      (fcl as any).suggestFCLTokens ??
      (fcl as any).experimental?.suggestFCLTokens;

    if (typeof suggestFn === 'function') {
      await suggestFn({
        tokens: [
          {
            contractName: 'NDAOToken',
            contractAddress: CONTRACTS,
            storagePath: '/storage/NDAOVault',
            publicPath: '/public/NDAOVault',
            receiverPath: '/public/NDAOReceiver',
            vaultType: `A.${CONTRACTS.replace('0x', '')}.NDAOToken.Vault`,
          },
        ],
      });
    } else {
      // Fallback: run SetupNDAOVault so the vault is registered on-chain,
      // then the wallet will detect it via FTDisplay metadata automatically.
      await FlowService.setupNDAOVault();
    }
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  static async getProposalVotes(proposalId: string): Promise<any> {
    const result = await fcl.query({
      cadence: `
        import VotingContract from ${CONTRACTS}

        access(all) fun main(proposalId: String): {String: UInt64} {
          return VotingContract.getVoteTally(proposalId: proposalId)
        }
      `,
      args: (arg: any, t: any) => [arg(proposalId, t.String)],
    });
    return result;
  }

  static async getDAOTokenBalance(address: string): Promise<number> {
    try {
      const result = await fcl.query({
        cadence: `
          import NDAOToken from ${CONTRACTS}
          import FungibleToken from 0x9a0766d93b6608b7

          access(all) fun main(address: Address): UFix64 {
            let vaultRef = getAccount(address)
              .capabilities.get<&NDAOToken.Vault>(/public/NDAOTokenVault)
              .borrow()
            return vaultRef?.balance ?? 0.0
          }
        `,
        args: (arg: any, t: any) => [arg(address, t.Address)],
      });
      return parseFloat(result) || 0;
    } catch {
      return 0;
    }
  }
}
