access(all) contract ProposalRegistry {
    
    access(all) event ProposalCreated(id: String, cid: String, title: String, author: Address, timestamp: UFix64)
    access(all) event ProposalStatusUpdated(id: String, newStatus: String)
    
    access(all) struct Proposal {
        access(all) let id: String
        access(all) let cid: String
        access(all) let title: String
        access(all) let metadata: String
        access(all) let author: Address
        access(all) let timestamp: UFix64
        access(all) var status: String
        
        init(id: String, cid: String, title: String, metadata: String, author: Address) {
            self.id = id
            self.cid = cid
            self.title = title
            self.metadata = metadata
            self.author = author
            self.timestamp = getCurrentBlock().timestamp
            self.status = "Draft"
        }
        
        access(all) fun updateStatus(newStatus: String) {
            self.status = newStatus
        }
    }
    
    access(all) let proposals: {String: Proposal}
    
    access(all) fun createProposal(id: String, cid: String, title: String, metadata: String, author: Address) {
        pre {
            self.proposals[id] == nil: "Proposal with this ID already exists"
        }
        
        let proposal = Proposal(id: id, cid: cid, title: title, metadata: metadata, author: author)
        self.proposals[id] = proposal
        
        emit ProposalCreated(id: id, cid: cid, title: title, author: author, timestamp: proposal.timestamp)
    }
    
    access(all) fun getProposal(id: String): Proposal? {
        return self.proposals[id]
    }
    
    access(all) fun updateProposalStatus(id: String, newStatus: String) {
        if let proposal = self.proposals[id] {
            proposal.updateStatus(newStatus: newStatus)
            emit ProposalStatusUpdated(id: id, newStatus: newStatus)
        }
    }
    
    init() {
        self.proposals = {}
    }
}
