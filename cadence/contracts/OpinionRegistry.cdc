access(all) contract OpinionRegistry {
    
    access(all) event OpinionRegistered(id: UInt64, cid: String, author: Address, timestamp: UFix64)
    
    access(all) struct Opinion {
        access(all) let id: UInt64
        access(all) let cid: String
        access(all) let metadata: String
        access(all) let author: Address
        access(all) let timestamp: UFix64
        
        init(id: UInt64, cid: String, metadata: String, author: Address) {
            self.id = id
            self.cid = cid
            self.metadata = metadata
            self.author = author
            self.timestamp = getCurrentBlock().timestamp
        }
    }
    
    access(all) var nextOpinionID: UInt64
    access(all) let opinions: {UInt64: Opinion}
    
    access(all) fun registerOpinion(cid: String, metadata: String, author: Address): UInt64 {
        let opinionID = self.nextOpinionID
        let opinion = Opinion(id: opinionID, cid: cid, metadata: metadata, author: author)
        
        self.opinions[opinionID] = opinion
        self.nextOpinionID = opinionID + 1
        
        emit OpinionRegistered(id: opinionID, cid: cid, author: author, timestamp: opinion.timestamp)
        
        return opinionID
    }
    
    access(all) fun getOpinion(id: UInt64): Opinion? {
        return self.opinions[id]
    }
    
    access(all) fun getOpinionsByCID(cid: String): [Opinion] {
        let results: [Opinion] = []
        for opinion in self.opinions.values {
            if opinion.cid == cid {
                results.append(opinion)
            }
        }
        return results
    }
    
    init() {
        self.nextOpinionID = 1
        self.opinions = {}
    }
}
