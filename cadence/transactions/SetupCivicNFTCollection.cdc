import NonFungibleToken from 0x631e88ae7f1d7c20
import CivicNFT from 0xb0cc0436d4ca392a

/// Sets up a CivicNFT collection in the signer's account.
/// Safe to call multiple times — skips if already set up.
transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        if signer.storage.borrow<&CivicNFT.Collection>(from: CivicNFT.CollectionStoragePath) != nil {
            return
        }

        let collection <- CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
        signer.storage.save(<-collection, to: CivicNFT.CollectionStoragePath)

        let collectionCap = signer.capabilities.storage.issue<&CivicNFT.Collection>(CivicNFT.CollectionStoragePath)
        signer.capabilities.publish(collectionCap, at: CivicNFT.CollectionPublicPath)
    }
}
