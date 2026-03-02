import { fcl } from '@/lib/config/flow';
import * as t from '@onflow/types';

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

  static async storeOpinionHash(cid: string, metadata: string): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import OpinionRegistry from 0xc945e2d25f0a93ed

        transaction(cid: String, metadata: String) {
          prepare(signer: &Account) {
            OpinionRegistry.registerOpinion(cid: cid, metadata: metadata, author: signer.address)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(cid, t.String),
        arg(metadata, t.String)
      ],
      limit: 100
    });

    return txId;
  }

  static async storeProposalHash(cid: string, title: string, metadata: string): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import ProposalRegistry from 0xc945e2d25f0a93ed

        transaction(cid: String, title: String, metadata: String) {
          prepare(signer: &Account) {
            ProposalRegistry.createProposal(cid: cid, title: title, metadata: metadata, author: signer.address)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(cid, t.String),
        arg(title, t.String),
        arg(metadata, t.String)
      ],
      limit: 100
    });

    return txId;
  }

  static async castVote(proposalId: string, choice: 'support' | 'against'): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import VotingContract from 0xc945e2d25f0a93ed

        transaction(proposalId: String, choice: String) {
          prepare(signer: &Account) {
            VotingContract.castVote(proposalId: proposalId, choice: choice, voter: signer.address)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(proposalId, t.String),
        arg(choice, t.String)
      ],
      limit: 100
    });

    return txId;
  }

  static async getProposalVotes(proposalId: string): Promise<any> {
    const result = await fcl.query({
      cadence: `
        import VotingContract from 0xc945e2d25f0a93ed

        access(all) fun main(proposalId: String): {String: UInt64} {
          return VotingContract.getVoteTally(proposalId: proposalId)
        }
      `,
      args: (arg: any, t: any) => [arg(proposalId, t.String)]
    });

    return result;
  }

  static async getDAOTokenBalance(address: string): Promise<number> {
    const result = await fcl.query({
      cadence: `
        import NDAOToken from 0xc945e2d25f0a93ed

        access(all) fun main(address: Address): UFix64 {
          return NDAOToken.getBalance(address: address)
        }
      `,
      args: (arg: any, t: any) => [arg(address, t.Address)]
    });

    return parseFloat(result);
  }

  static async mintCivicNFT(recipient: string, badgeType: string): Promise<string> {
    const txId = await fcl.mutate({
      cadence: `
        import CivicNFT from 0xc945e2d25f0a93ed

        transaction(recipient: Address, badgeType: String) {
          prepare(signer: &Account) {
            CivicNFT.mintBadge(recipient: recipient, badgeType: badgeType)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(recipient, t.Address),
        arg(badgeType, t.String)
      ],
      limit: 100
    });

    return txId;
  }
}
