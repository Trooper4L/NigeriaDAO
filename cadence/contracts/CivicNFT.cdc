import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
import ViewResolver from 0x631e88ae7f1d7c20

access(all) contract CivicNFT: NonFungibleToken {

    access(all) var totalSupply: UInt64

    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event BadgeMinted(id: UInt64, badgeType: String, recipient: Address)

    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let badgeType: String
        access(all) let name: String
        access(all) let description: String
        access(all) let soulbound: Bool
        access(all) let mintedAt: UFix64

        init(id: UInt64, badgeType: String, soulbound: Bool) {
            self.id = id
            self.badgeType = badgeType
            self.soulbound = soulbound
            self.mintedAt = getCurrentBlock().timestamp

            switch badgeType {
                case "participation":
                    self.name = "Civic Participation Badge"
                    self.description = "Awarded for active civic engagement"
                case "governance":
                    self.name = "Governance Contributor Badge"
                    self.description = "Awarded for governance participation"
                case "contribution":
                    self.name = "Outstanding Contribution Badge"
                    self.description = "Awarded for exceptional civic contributions"
                default:
                    self.name = "Civic Badge"
                    self.description = "Civic engagement badge"
            }
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
        }

        access(all) view fun getViews(): [Type] {
            return [Type<MetadataViews.Display>()]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: MetadataViews.HTTPFile(url: "")
                    )
            }
            return nil
        }
    }

    access(all) resource Collection: NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init() {
            self.ownedNFTs <- {}
        }

        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            return {Type<@CivicNFT.NFT>(): true}
        }

        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@CivicNFT.NFT>()
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("NFT not found in collection")

            let nft <- token as! @CivicNFT.NFT
            if nft.soulbound {
                panic("Cannot transfer soulbound NFT")
            }

            emit Withdraw(id: nft.id, from: self.owner?.address)
            return <-nft
        }

        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let nft <- token as! @CivicNFT.NFT
            let id = nft.id
            self.ownedNFTs[id] <-! nft
            emit Deposit(id: id, to: self.owner?.address)
        }

        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun getLength(): Int {
            return self.ownedNFTs.length
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id]
        }

        access(all) fun forEachID(_ f: fun(UInt64): Bool): Void {
            for id in self.ownedNFTs.keys {
                if !f(id) {
                    break
                }
            }
        }

        access(all) view fun borrowViewResolver(id: UInt64): &{ViewResolver.Resolver}? {
            let nft = &self.ownedNFTs[id] as &{NonFungibleToken.NFT}?
            if let n = nft {
                return n as! &CivicNFT.NFT
            }
            return nil
        }
    }

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <-create Collection()
    }

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [Type<MetadataViews.NFTCollectionData>()]
    }

    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: CivicNFT.CollectionStoragePath,
                    publicPath: CivicNFT.CollectionPublicPath,
                    publicCollection: Type<&CivicNFT.Collection>(),
                    publicLinkedType: Type<&CivicNFT.Collection>(),
                    createEmptyCollectionFunction: fun(): @{NonFungibleToken.Collection} {
                        return <-CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
                    }
                )
        }
        return nil
    }

    access(all) resource Minter {
        access(all) fun mintBadge(recipient: Address, badgeType: String, soulbound: Bool): UInt64 {
            let recipientCollection = getAccount(recipient)
                .capabilities.get<&CivicNFT.Collection>(CivicNFT.CollectionPublicPath)
                .borrow()
                ?? panic("Could not borrow collection reference")

            let nft <- create NFT(id: CivicNFT.totalSupply, badgeType: badgeType, soulbound: soulbound)
            let nftID = nft.id

            recipientCollection.deposit(token: <-nft)
            CivicNFT.totalSupply = CivicNFT.totalSupply + 1

            emit BadgeMinted(id: nftID, badgeType: badgeType, recipient: recipient)
            return nftID
        }
    }

    init() {
        self.totalSupply = 0

        self.CollectionStoragePath = /storage/CivicNFTCollection
        self.CollectionPublicPath = /public/CivicNFTCollection
        self.MinterStoragePath = /storage/CivicNFTMinter

        let collection <- create Collection()
        self.account.storage.save(<-collection, to: self.CollectionStoragePath)

        let collectionCap = self.account.capabilities.storage.issue<&Collection>(self.CollectionStoragePath)
        self.account.capabilities.publish(collectionCap, at: self.CollectionPublicPath)

        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}
