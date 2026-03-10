transaction(code: String) {
    prepare(signer: auth(UpdateContract) &Account) {
        signer.contracts.update(name: "NDAOToken", code: code.decodeHex())
    }
}
