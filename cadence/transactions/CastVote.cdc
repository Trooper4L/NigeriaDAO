import VotingContract from "../contracts/VotingContract.cdc"

transaction(proposalId: String, choice: String) {
    prepare(signer: auth(Storage) &Account) {
        let voter = signer.address
        VotingContract.castVote(proposalId: proposalId, choice: choice, voter: voter, weight: 1)
        log("Vote cast on proposal: ".concat(proposalId))
    }
}
