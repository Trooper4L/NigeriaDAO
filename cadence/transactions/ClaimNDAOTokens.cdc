import NDAOToken from 0x513ea4a723716b6f

/// Claims NDAO tokens for the signer.
/// Vault must already be set up via SetupNDAOVault.
transaction(amount: UFix64) {
    prepare(signer: auth(Storage) &Account) {
        NDAOToken.claimTokens(amount: amount, recipient: signer.address)
    }
}
