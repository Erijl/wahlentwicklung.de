class Election:
    def __init__(self, election_id, year, active=False):
        self.election_id = election_id
        self.year = year
        self.active = active

    def to_dict(self):
        return {
            "election_id": self.election_id,
            "year": self.year,
            "active": self.active
        }


class District:
    def __init__(self, district_id, election_id, state_id, identifier, name, eligible_voters=None, voters=None,
                 invalid_votes=None, valid_votes=None):
        self.district_id = district_id
        self.election_id = election_id
        self.state_id = state_id
        self.identifier = identifier
        self.name = name
        self.eligible_voters = eligible_voters
        self.voters = voters
        self.invalid_votes = invalid_votes
        self.valid_votes = valid_votes

    def to_dict(self):
        return {
            "district_id": self.district_id,
            "name": self.name,
            "eligible_voters": self.eligible_voters,
            "voters": self.voters,
            "invalid_votes": self.invalid_votes,
            "valid_votes": self.valid_votes,
            "election_id": self.election_id,
            "state_id": self.state_id,
            "identifier": self.identifier
        }


class DistrictNID:
    def __init__(self, election_id, state_id, identifier, name, eligible_voters=None, voters=None, invalid_votes=None,
                 valid_votes=None):
        self.election_id = election_id
        self.state_id = state_id
        self.identifier = identifier
        self.name = name
        self.eligible_voters = eligible_voters
        self.voters = voters
        self.invalid_votes = invalid_votes
        self.valid_votes = valid_votes

    def to_dict(self):
        return {
            "name": self.name,
            "eligible_voters": self.eligible_voters,
            "voters": self.voters,
            "invalid_votes": self.invalid_votes,
            "valid_votes": self.valid_votes,
            "election_id": self.election_id,
            "state_id": self.state_id,
            "identifier": self.identifier
        }


class PartyVotes:
    def __init__(self, vote_id, party_id=None, district_id=None, votes=None):
        self.vote_id = vote_id
        self.party_id = party_id
        self.district_id = district_id
        self.votes = votes

    def to_dict(self):
        return {
            "vote_id": self.vote_id,
            "party_id": self.party_id,
            "district_id": self.district_id,
            "votes": self.votes,
        }


class PartyVotesNID:
    def __init__(self, party_id=None, district_id=None, votes=None):
        self.party_id = party_id
        self.district_id = district_id
        self.votes = votes

    def to_dict(self):
        return {
            "party_id": self.party_id,
            "district_id": self.district_id,
            "votes": self.votes,
        }


class Party:
    def __init__(self, party_id, name, election_id=None, color_hex=None):
        self.party_id = party_id
        self.name = name
        self.election_id = election_id
        self.color_hex = color_hex

    def to_dict(self):
        return {
            "party_id": self.party_id,
            "name": self.name,
            "election_id": self.election_id,
            "color_hex": self.color_hex
        }


class PartyNID:
    def __init__(self, name, election_id, color_hex=None):
        self.name = name
        self.election_id = election_id
        self.color_hex = color_hex

    def to_dict(self):
        return {
            "name": self.name,
            "election_id": self.election_id,
            "color_hex": self.color_hex
        }


class StateVotes:
    def __init__(self, state_votes_id, election_id=None, state_id=None, eligible_voters=None, voters=None,
                 invalid_votes=None, valid_votes=None):
        self.state_votes_id = state_votes_id
        self.election_id = election_id
        self.state_id = state_id
        self.eligible_voters = eligible_voters
        self.voters = voters
        self.invalid_votes = invalid_votes
        self.valid_votes = valid_votes

    def to_dict(self):
        return {
            "state_votes_id": self.state_votes_id,
            "election_id": self.election_id,
            "state_id": self.state_id,
            "eligible_voters": self.eligible_voters,
            "voters": self.voters,
            "invalid_votes": self.invalid_votes,
            "valid_votes": self.valid_votes
        }


class StateVotesNID:
    def __init__(self, election_id=None, state_id=None, eligible_voters=None, voters=None,
                 invalid_votes=None, valid_votes=None):
        self.election_id = election_id
        self.state_id = state_id
        self.eligible_voters = eligible_voters
        self.voters = voters
        self.invalid_votes = invalid_votes
        self.valid_votes = valid_votes

    def to_dict(self):
        return {
            "election_id": self.election_id,
            "state_id": self.state_id,
            "eligible_voters": self.eligible_voters,
            "voters": self.voters,
            "invalid_votes": self.invalid_votes,
            "valid_votes": self.valid_votes
        }


class State:
    def __init__(self, state_id, name, identifier=None, abbreviation=None):
        self.state_id = state_id
        self.name = name
        self.identifier = identifier
        self.abbreviation = abbreviation

    def to_dict(self):
        return {
            "state_id": self.state_id,
            "name": self.name,
            "identifier": self.identifier,
            "abbreviation": self.abbreviation
        }
