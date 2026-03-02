import OpinionRegistry from "../contracts/OpinionRegistry.cdc"

access(all) fun main(id: UInt64): OpinionRegistry.Opinion? {
    return OpinionRegistry.getOpinion(id: id)
}
