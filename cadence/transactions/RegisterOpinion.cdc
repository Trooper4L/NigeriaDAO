import OpinionRegistry from "../contracts/OpinionRegistry.cdc"

transaction(cid: String, metadata: String) {
    prepare(signer: auth(Storage) &Account) {
        let author = signer.address
        let id = OpinionRegistry.registerOpinion(cid: cid, metadata: metadata, author: author)
        log("Opinion registered with ID: ".concat(id.toString()))
    }
}
