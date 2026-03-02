import FungibleToken from 0x9a0766d93b6608b7

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
    }
    
    access(all) fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }
    
    access(all) resource Minter {
        access(all) fun mintTokens(amount: UFix64, recipient: Address) {
            let recipientVault = getAccount(recipient)
                .capabilities.get<&{FungibleToken.Receiver}>(NDAOToken.ReceiverPublicPath)
                .borrow()
                ?? panic("Could not borrow receiver reference")
            
            NDAOToken.totalSupply = NDAOToken.totalSupply + amount
            recipientVault.deposit(from: <-create Vault(balance: amount))
            
            emit TokensMinted(amount: amount, to: recipient)
        }
    }
    
    access(all) fun getBalance(address: Address): UFix64 {
        let vaultRef = getAccount(address)
            .capabilities.get<&NDAOToken.Vault>(NDAOToken.VaultPublicPath)
            .borrow()
        
        return vaultRef?.balance ?? 0.0
    }
    
    init() {
        self.totalSupply = 1000000.0
        
        self.VaultStoragePath = /storage/NDAOTokenVault
        self.VaultPublicPath = /public/NDAOTokenVault
        self.ReceiverPublicPath = /public/NDAOTokenReceiver
        self.MinterStoragePath = /storage/NDAOTokenMinter
        
        let vault <- create Vault(balance: self.totalSupply)
        self.account.storage.save(<-vault, to: self.VaultStoragePath)
        
        let vaultCap = self.account.capabilities.storage.issue<&Vault>(self.VaultStoragePath)
        self.account.capabilities.publish(vaultCap, at: self.VaultPublicPath)
        self.account.capabilities.publish(vaultCap, at: self.ReceiverPublicPath)
        
        let minter <- create Minter()
        self.account.storage.save(<-minter, to: self.MinterStoragePath)
        
        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
