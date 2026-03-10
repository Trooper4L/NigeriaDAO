import CivicNFT from 0x513ea4a723716b6f

/// Claims a CivicNFT badge for the signer.
/// Collection must already be set up via SetupCivicNFTCollection.
transaction(badgeType: String) {
    prepare(signer: auth(Storage) &Account) {
        CivicNFT.claimBadge(recipient: signer.address, badgeType: badgeType)
    }
}
