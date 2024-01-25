import os
from dotenv import load_dotenv
from supabase import create_client, Client
import csv
from models import Election, Party, PartyNID, PartyVotes, PartyVotesNID, District, DistrictNID, State, StateVotes, \
    StateVotesNID


def parse_to_int(value):
    if value is None:
        return 0
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.strip():  # Check if it's a non-empty string
        return int(value)
    return 0  # Default case


load_dotenv()

# CHANGE PARAMETERS ACCORDINGLY
skip_entries = 5
party_beginning = 19  # column where the first party name is
party_distance = 4  # distance between party(s) (names)
year: int = 2017
# CHANGE PARAMETERS ACCORDINGLY


url: str = os.getenv("_SUPABASE_URL")
key: str = os.getenv("_SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

# get Wahlen
election_raw = supabase.table("election").select("*").execute()
election_list = [Election(**data) for data in election_raw.data]
election = next(filter(lambda obj: obj.year == year, election_list), None)

# get Bundesländer
state_raw = supabase.table("state").select("*").execute()
state_list = [State(**data) for data in state_raw.data]

with open('data/btw2017_kerg.csv', newline='',
          encoding='utf-8') as csvfile:  # Files newer than 2013 are commonly saved in the format UTF-8, older files may be saved in windows-1252; Check before importing!
    print(csvfile)
    reader = csv.reader(csvfile, delimiter='|')  # Usage of not relevant delimiter to allow access using array syntax

    csv_data = list(reader)

csv_data = csv_data[skip_entries:]

state_votes_dicts = []
district_dicts = []
party_dicts = []
party_votes = []
party_votes_dicts = []

for index, row in enumerate(csv_data):
    entries = str(row[0]).split(';')

    if entries[0] != '':

        if index == 0:
            for party_index, entry in enumerate(entries):

                if party_index >= party_beginning and entries[party_index] != '':
                    party = PartyNID(entries[party_index], election.election_id)

                    party_dicts.append(party.to_dict())

        # create bundesland stimmen
        if entries[0] != "Nr" and int(entries[0]) >= 900:
            state = next(filter(lambda bland: bland.identifier == int(entries[0]), state_list), None)

            state_votes = StateVotesNID(election.election_id, state.state_id, {
                "primary_votes_final": parse_to_int(entries[3]),
                "primary_votes_prior": parse_to_int(entries[4]),
                "secondary_votes_final": parse_to_int(entries[5]),
                "secondary_votes_prior": parse_to_int(entries[6]),
            }, {
                                            "primary_votes_final": parse_to_int(entries[7]),
                                            "primary_votes_prior": parse_to_int(entries[8]),
                                            "secondary_votes_final": parse_to_int(entries[9]),
                                            "secondary_votes_prior": parse_to_int(entries[10]),
                                        }, {
                                            "primary_votes_final": parse_to_int(entries[11]),
                                            "primary_votes_prior": parse_to_int(entries[12]),
                                            "secondary_votes_final": parse_to_int(entries[13]),
                                            "secondary_votes_prior": parse_to_int(entries[14]),
                                        }, {
                                            "primary_votes_final": parse_to_int(entries[15]),
                                            "primary_votes_prior": parse_to_int(entries[16]),
                                            "secondary_votes_final": parse_to_int(entries[17]),
                                            "secondary_votes_prior": parse_to_int(entries[18]),
                                        })
            state_votes_dicts.append(state_votes.to_dict())

        # create wahlkreis & wahlkreis stimmen
        elif entries[0] != "Nr" and int(entries[0]) < 900:
            state = next(filter(lambda bland: bland.identifier == int(entries[2]), state_list), None)

            districts = DistrictNID(election.election_id, state.state_id, entries[0], entries[1], {
                "primary_votes_final": parse_to_int(entries[3]),
                "primary_votes_prior": parse_to_int(entries[4]),
                "secondary_votes_final": parse_to_int(entries[5]),
                "secondary_votes_prior": parse_to_int(entries[6]),
            }, {
                                        "primary_votes_final": parse_to_int(entries[7]),
                                        "primary_votes_prior": parse_to_int(entries[8]),
                                        "secondary_votes_final": parse_to_int(entries[9]),
                                        "secondary_votes_prior": parse_to_int(entries[10]),
                                    }, {
                                        "primary_votes_final": parse_to_int(entries[11]),
                                        "primary_votes_prior": parse_to_int(entries[12]),
                                        "secondary_votes_final": parse_to_int(entries[13]),
                                        "secondary_votes_prior": parse_to_int(entries[14]),
                                    }, {
                                        "primary_votes_final": parse_to_int(entries[15]),
                                        "primary_votes_prior": parse_to_int(entries[16]),
                                        "secondary_votes_final": parse_to_int(entries[17]),
                                        "secondary_votes_prior": parse_to_int(entries[18]),
                                    })

            district_dicts.append(districts.to_dict())

            # Partei Stimmen dicts
            p_index = party_beginning
            while p_index < len(entries):
                # TODO change if supporting years with just 2 types of votes instead of 4
                party_votes_local = PartyVotesNID(str(csv_data[0]).split(';')[p_index], districts.identifier, {
                    "primary_votes_final": parse_to_int(entries[p_index]),
                    "primary_votes_prior": parse_to_int(entries[p_index + 1]),
                    "secondary_votes_final": parse_to_int(entries[p_index + 2]),
                    "secondary_votes_prior": parse_to_int(entries[p_index + 3]),
                })
                party_votes.append(party_votes_local)

                p_index += party_distance

state_response = supabase.table("state_votes").insert(state_votes_dicts).execute()
district_response = supabase.table("district").insert(district_dicts).execute()
partei_response = supabase.table("party").insert(party_dicts).execute()

district_response_list = [District(**data) for data in district_response.data]
party_response_list = [Party(**data) for data in partei_response.data]

for p_vote in party_votes:
    p_vote.district_id = next(
        filter(lambda obj: obj.identifier == int(p_vote.district_id), district_response_list), None).district_id
    p_vote.party_id = next(filter(lambda obj: obj.name == p_vote.party_id, party_response_list), None).party_id

    party_votes_dicts.append(p_vote.to_dict())

party_votes_response = supabase.table("party_votes").insert(party_votes_dicts).execute()
