import NDAOToken from 0xb0cc0436d4ca392a

/// Claims NDAO tokens for the signer.
/// Vault must already be set up via SetupNDAOVault.
transaction(amount: UFix64) {
    prepare(signer: auth(Storage) &Account) {
        NDAOToken.claimTokens(amount: amount, recipient: signer.address)
    }
}
