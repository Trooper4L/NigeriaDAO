import ProposalRegistry from "../contracts/ProposalRegistry.cdc"

access(all) fun main(id: String): ProposalRegistry.Proposal? {
    return ProposalRegistry.getProposal(id: id)
}
