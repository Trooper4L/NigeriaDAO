import ProposalRegistry from "../contracts/ProposalRegistry.cdc"

transaction(id: String, cid: String, title: String, metadata: String) {
    prepare(signer: auth(Storage) &Account) {
        let author = signer.address
        ProposalRegistry.createProposal(id: id, cid: cid, title: title, metadata: metadata, author: author)
        log("Proposal created: ".concat(title))
    }
}
