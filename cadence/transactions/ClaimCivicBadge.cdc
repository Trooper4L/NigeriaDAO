import CivicNFT from 0xb0cc0436d4ca392a

/// Claims a CivicNFT badge for the signer.
/// Collection must already be set up via SetupCivicNFTCollection.
transaction(badgeType: String) {
    prepare(signer: auth(Storage) &Account) {
        CivicNFT.claimBadge(recipient: signer.address, badgeType: badgeType)
    }
}
