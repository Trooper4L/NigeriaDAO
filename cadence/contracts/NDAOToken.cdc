import FungibleToken from 0x9a0766d93b6608b7
import FungibleTokenMetadataViews from 0x9a0766d93b6608b7
import MetadataViews from 0x631e88ae7f1d7c20

access(all) contract NDAOToken: FungibleToken {

    access(all) var totalSupply: UFix64

    access(all) event TokensInitialized(initialSupply: UFix64)
    access(all) event TokensWithdrawn(amount: UFix64, from: Address?)
    access(all) event TokensDeposited(amount: UFix64, to: Address?)
    access(all) event TokensMinted(amount: UFix64, to: Address)
    access(all) event TokensBurned(amount: UFix64, from: Address)

    access(all) let VaultStoragePath: StoragePath
    access(all) let VaultPublicPath: PublicPath
    access(all) let ReceiverPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    access(all) resource Vault: FungibleToken.Vault {
        access(all) var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        access(all) fun withdraw(amount: UFix64): @{FungibleToken.Vault} {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        access(all) fun deposit(from: @{FungibleToken.Vault}) {
            let vault <- from as! @NDAOToken.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        access(all) view fun getViews(): [Type] {
            return [
                Type<FungibleTokenMetadataViews.FTView>(),
                Type<FungibleTokenMetadataViews.FTDisplay>(),
                Type<FungibleTokenMetadataViews.FTVaultData>()
            ]
        }

        access(all) fun resolveView(_ view: Type): AnyStruct? {
            return NDAOToken.resolveContractView(resourceType: nil, viewType: view)
        }

        access(all) fun createEmptyVault(): @{FungibleToken.Vault} {
            return <-create Vault(balance: 0.0)
        }
    }

    access(all) fun createEmptyVault(vaultType: Type): @{FungibleToken.Vault} {
        return <-create Vault(balance: 0.0)
    }

    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<FungibleTokenMetadataViews.FTView>(),
            Type<FungibleTokenMetadataViews.FTDisplay>(),
            Type<FungibleTokenMetadataViews.FTVaultData>()
        ]
    }

    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<FungibleTokenMetadataViews.FTView>():
                return FungibleTokenMetadataViews.FTView(
                    ftDisplay: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTDisplay>()) as! FungibleTokenMetadataViews.FTDisplay?,
                    ftVaultData: self.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                )
            case Type<FungibleTokenMetadataViews.FTDisplay>():
                let media = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(
                        url: "https://raw.githubusercontent.com/Tropixone/NigeriaDAO/main/public/ndao-token.svg"
                    ),
                    mediaType: "image/svg+xml"
                )
                return FungibleTokenMetadataViews.FTDisplay(
                    name: "NigeriaDAO Governance Token",
                    symbol: "NDAO",
                    description: "NDAO is the governance token of NigeriaDAO — earned by civic participation, voting, and contributing proposals on the Nigerian civic platform.",
                    externalURL: MetadataViews.ExternalURL("https://naijadao.vercel.app"),
                    logos: MetadataViews.Medias(items: [media]),
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/NigeriaDAO")
                    }
                )
            case Type<FungibleTokenMetadataViews.FTVaultData>():
                return FungibleTokenMetadataViews.FTVaultData(
                    storagePath: NDAOToken.VaultStoragePath,
                    receiverPath: NDAOToken.ReceiverPublicPath,
                    metadataPath: NDAOToken.VaultPublicPath,
                    receiverLinkedType: Type<&{FungibleToken.Receiver}>(),
                    metadataLinkedType: Type<&NDAOToken.Vault>(),
                    createEmptyVaultFunction: fun(): @{FungibleToken.Vault} {
                        return <-NDAOToken.createEmptyVault(vaultType: Type<@NDAOToken.Vault>())
                    }
                )
        }
        return nil
    }

    // Public claim: any user can call this to mint NDAO into their own vault.
    // Vault must be set up at VaultPublicPath via SetupNDAOVault transaction.
    access(all) fun claimTokens(amount: UFix64, recipient: Address) {
        let recipientVault = getAccount(recipient)
            .capabilities.get<&NDAOToken.Vault>(NDAOToken.VaultPublicPath)
            .borrow()
            ?? panic("Could not borrow vault: run SetupNDAOVault transaction first")

        NDAOToken.totalSupply = NDAOToken.totalSupply + amount
        recipientVault.deposit(from: <-create Vault(balance: amount))
        emit TokensMinted(amount: amount, to: recipient)
    }

    access(all) resource Minter {
        access(all) fun mintTokens(amount: UFix64, recipient: Address) {
            let recipientVault = getAccount(recipient)
                .capabilities.get<&NDAOToken.Vault>(NDAOToken.VaultPublicPath)
                .borrow()
                ?? panic("Could not borrow vault: run SetupNDAOVault transaction first")

            NDAOToken.totalSupply = NDAOToken.totalSupply + amount
            recipientVault.deposit(from: <-create Vault(balance: amount))

            emit TokensMinted(amount: amount, to: recipient)
        }
    }

    init() {
        self.totalSupply = 0.0

        self.VaultStoragePath = /storage/NDAOTokenVault
        self.VaultPublicPath = /public/NDAOTokenVault
        self.ReceiverPublicPath = /public/NDAOTokenReceiver
        self.MinterStoragePath = /storage/NDAOTokenMinter

        let vault <- create Vault(balance: 0.0)
        self.account.storage.save(<-vault, to: self.VaultStoragePath)

        let vaultCap = self.account.capabilities.storage.issue<&Vault>(self.VaultStoragePath)
        self.account.capabilities.publish(vaultCap, at: self.VaultPublicPath)

        let receiverCap = self.account.capabilities.storage.issue<&{FungibleToken.Receiver}>(self.VaultStoragePath)
        self.account.capabilities.publish(receiverCap, at: self.ReceiverPublicPath)

        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)

        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
