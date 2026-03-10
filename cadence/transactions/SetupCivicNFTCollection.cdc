import NonFungibleToken from 0x631e88ae7f1d7c20
import CivicNFT from 0x513ea4a723716b6f

/// Sets up a CivicNFT collection in the signer's account.
/// Safe to call multiple times — skips if already set up.
transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        let storagePath = /storage/CivicNFTCollection
        let publicPath = /public/CivicNFTCollection

        if signer.storage.borrow<&CivicNFT.Collection>(from: storagePath) != nil {
            return
        }

        let collection <- CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
        signer.storage.save(<-collection, to: storagePath)

        let collectionCap = signer.capabilities.storage.issue<&CivicNFT.Collection>(storagePath)
        signer.capabilities.publish(collectionCap, at: publicPath)
    }
}
