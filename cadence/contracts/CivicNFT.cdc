import NonFungibleToken from 0x631e88ae7f1d7c20

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
    }
    
    access(all) resource Collection: NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}
        
        init() {
            self.ownedNFTs <- {}
        }
        
        access(all) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
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
            let token <- token as! @CivicNFT.NFT
            let id = token.id
            
            self.ownedNFTs[id] <-! token
            
            emit Deposit(id: id, to: self.owner?.address)
        }
        
        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }
        
        access(all) fun borrowNFT(id: UInt64): &{NonFungibleToken.NFT} {
            return (&self.ownedNFTs[id] as &{NonFungibleToken.NFT}?)!
        }
    }
    
    access(all) fun createEmptyCollection(): @Collection {
        return <-create Collection()
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
