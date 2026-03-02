import NDAOToken from "../contracts/NDAOToken.cdc"

access(all) fun main(address: Address): UFix64 {
    return NDAOToken.getBalance(address: address)
}
