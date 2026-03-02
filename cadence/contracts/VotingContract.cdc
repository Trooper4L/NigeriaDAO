access(all) contract VotingContract {
    
    access(all) event VoteCast(proposalId: String, voter: Address, choice: String, weight: UInt64, timestamp: UFix64)
    
    access(all) struct Vote {
        access(all) let proposalId: String
        access(all) let voter: Address
        access(all) let choice: String
        access(all) let weight: UInt64
        access(all) let timestamp: UFix64
        
        init(proposalId: String, voter: Address, choice: String, weight: UInt64) {
            self.proposalId = proposalId
            self.voter = voter
            self.choice = choice
            self.weight = weight
            self.timestamp = getCurrentBlock().timestamp
        }
    }
    
    access(all) let votes: {String: {Address: Vote}}
    access(all) let voteTallies: {String: {String: UInt64}}
    
    access(all) fun castVote(proposalId: String, choice: String, voter: Address, weight: UInt64) {
        pre {
            choice == "support" || choice == "against": "Choice must be 'support' or 'against'"
            weight > 0: "Vote weight must be greater than 0"
        }
        
        if self.votes[proposalId] == nil {
            self.votes[proposalId] = {}
        }
        
        if self.voteTallies[proposalId] == nil {
            self.voteTallies[proposalId] = {"support": 0, "against": 0}
        }
        
        if let existingVote = self.votes[proposalId]![voter] {
            let oldChoice = existingVote.choice
            let oldWeight = existingVote.weight
            self.voteTallies[proposalId]![oldChoice] = self.voteTallies[proposalId]![oldChoice]! - oldWeight
        }
        
        let vote = Vote(proposalId: proposalId, voter: voter, choice: choice, weight: weight)
        self.votes[proposalId]!.insert(key: voter, vote)
        
        self.voteTallies[proposalId]![choice] = self.voteTallies[proposalId]![choice]! + weight
        
        emit VoteCast(proposalId: proposalId, voter: voter, choice: choice, weight: weight, timestamp: vote.timestamp)
    }
    
    access(all) fun getVoteTally(proposalId: String): {String: UInt64} {
        return self.voteTallies[proposalId] ?? {"support": 0, "against": 0}
    }
    
    access(all) fun hasVoted(proposalId: String, voter: Address): Bool {
        if let proposalVotes = self.votes[proposalId] {
            return proposalVotes[voter] != nil
        }
        return false
    }
    
    access(all) fun getVote(proposalId: String, voter: Address): Vote? {
        if let proposalVotes = self.votes[proposalId] {
            return proposalVotes[voter]
        }
        return nil
    }
    
    init() {
        self.votes = {}
        self.voteTallies = {}
    }
}
