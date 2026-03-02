import VotingContract from "../contracts/VotingContract.cdc"

access(all) fun main(proposalId: String): {String: UInt64} {
    return VotingContract.getVoteTally(proposalId: proposalId)
}
