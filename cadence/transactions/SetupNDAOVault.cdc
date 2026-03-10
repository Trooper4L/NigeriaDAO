import FungibleToken from 0x9a0766d93b6608b7
import NDAOToken from 0x513ea4a723716b6f

/// Sets up an NDAO token vault in the signer's account.
/// Publishes two capabilities:
///   - &NDAOToken.Vault at VaultPublicPath          (used by getBalance query)
///   - &{FungibleToken.Receiver} at ReceiverPublicPath  (used by claimTokens)
/// Safe to call multiple times — idempotent for each step.
transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        let storagePath = /storage/NDAOTokenVault
        let publicPath = /public/NDAOTokenVault
        let receiverPath = /public/NDAOTokenReceiver

        // Step 1: create vault if not present
        if signer.storage.borrow<&NDAOToken.Vault>(from: storagePath) == nil {
            let vault <- NDAOToken.createEmptyVault(vaultType: Type<@NDAOToken.Vault>())
            signer.storage.save(<-vault, to: storagePath)
        }

        // Step 2: publish concrete vault cap if missing (needed for balance query)
        if !signer.capabilities.get<&NDAOToken.Vault>(publicPath).check() {
            let vaultCap = signer.capabilities.storage.issue<&NDAOToken.Vault>(storagePath)
            signer.capabilities.publish(vaultCap, at: publicPath)
        }

        // Step 3: publish receiver interface cap if missing (needed for claimTokens)
        if !signer.capabilities.get<&{FungibleToken.Receiver}>(receiverPath).check() {
            let receiverCap = signer.capabilities.storage.issue<&{FungibleToken.Receiver}>(storagePath)
            signer.capabilities.publish(receiverCap, at: receiverPath)
        }
    }
}
