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

    // Returns the hosted image URL for a given badge type
    access(all) view fun badgeImageURL(_ badgeType: String): String {
        switch badgeType {
            case "participation":
                return "https://raw.githubusercontent.com/Tropixone/NigeriaDAO/main/public/badge-participation.png"
            case "governance":
                return "https://raw.githubusercontent.com/Tropixone/NigeriaDAO/main/public/badge-governance.png"
            case "contribution":
                return "https://raw.githubusercontent.com/Tropixone/NigeriaDAO/main/public/badge-contribution.png"
            default:
                return "https://raw.githubusercontent.com/Tropixone/NigeriaDAO/main/public/badge-civic.png"
        }
    }

    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) let badgeType: String
        access(all) let name: String
        access(all) let description: String
        access(all) let imageURL: String
        access(all) let soulbound: Bool
        access(all) let mintedAt: UFix64

        init(id: UInt64, badgeType: String, soulbound: Bool) {
            self.id = id
            self.badgeType = badgeType
            self.soulbound = soulbound
            self.mintedAt = getCurrentBlock().timestamp
            self.imageURL = CivicNFT.badgeImageURL(badgeType)

            switch badgeType {
                case "participation":
                    self.name = "Civic Participation Badge"
                    self.description = "Awarded to NigeriaDAO members for active civic engagement — voting on proposals and participating in governance."
                case "governance":
                    self.name = "Governance Contributor Badge"
                    self.description = "Awarded to NigeriaDAO members who have created civic proposals and driven governance participation."
                case "contribution":
                    self.name = "Outstanding Contribution Badge"
                    self.description = "Awarded to NigeriaDAO members for exceptional civic contributions that shaped the community."
                default:
                    self.name = "Civic Badge"
                    self.description = "A NigeriaDAO civic engagement badge."
            }
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-CivicNFT.createEmptyCollection(nftType: Type<@CivicNFT.NFT>())
        }

        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Editions>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.Traits>()
            ]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: MetadataViews.HTTPFile(url: self.imageURL)
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(self.id)
                case Type<MetadataViews.Editions>():
                    let editionInfo = MetadataViews.Edition(
                        name: self.badgeType,
                        number: self.id,
                        max: nil
                    )
                    let editionList: [MetadataViews.Edition] = [editionInfo]
                    return MetadataViews.Editions(editionList)
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://naijadao.vercel.app")
                case Type<MetadataViews.NFTCollectionData>():
                    return CivicNFT.resolveContractView(
                        resourceType: Type<@CivicNFT.NFT>(),
                        viewType: Type<MetadataViews.NFTCollectionData>()
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return CivicNFT.resolveContractView(
                        resourceType: Type<@CivicNFT.NFT>(),
                        viewType: Type<MetadataViews.NFTCollectionDisplay>()
                    )
                case Type<MetadataViews.Traits>():
                    let traitsView = MetadataViews.dictToTraits(
                        dict: {
                            "badgeType": self.badgeType,
                            "soulbound": self.soulbound ? "true" : "false",
                            "mintedAt": self.mintedAt.toString()
                        },
                        excludedNames: nil
                    )
                    return traitsView
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
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
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
            case Type<MetadataViews.NFTCollectionDisplay>():
                let media = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(
                        url: "https://raw.githubusercontent.com/Tropixone/NigeriaDAO/main/public/badge-civic.png"
                    ),
                    mediaType: "image/png"
                )
                return MetadataViews.NFTCollectionDisplay(
                    name: "NigeriaDAO Civic Badges",
                    description: "Soulbound civic achievement badges awarded to NigeriaDAO members for governance participation, voting, and community contributions.",
                    externalURL: MetadataViews.ExternalURL("https://naijadao.vercel.app"),
                    squareImage: media,
                    bannerImage: media,
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/NigeriaDAO")
                    }
                )
        }
        return nil
    }

    // Public claim: anyone can call this to mint a badge into their own collection.
    // The signer must already have a collection set up at CollectionPublicPath.
    access(all) fun claimBadge(recipient: Address, badgeType: String): UInt64 {
        let recipientCollection = getAccount(recipient)
            .capabilities.get<&CivicNFT.Collection>(CivicNFT.CollectionPublicPath)
            .borrow()
            ?? panic("Could not borrow collection: run SetupCivicNFTCollection transaction first")

        let nft <- create NFT(id: CivicNFT.totalSupply, badgeType: badgeType, soulbound: true)
        let nftID = nft.id

        recipientCollection.deposit(token: <-nft)
        CivicNFT.totalSupply = CivicNFT.totalSupply + 1

        emit BadgeMinted(id: nftID, badgeType: badgeType, recipient: recipient)
        return nftID
    }

    access(all) resource Minter {
        access(all) fun mintBadge(recipient: Address, badgeType: String, soulbound: Bool): UInt64 {
            return CivicNFT.claimBadge(recipient: recipient, badgeType: badgeType)
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
