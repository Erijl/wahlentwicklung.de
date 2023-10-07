import os
from dotenv import load_dotenv
from supabase import create_client, Client
import csv
from models import Wahl, Bundesland, ParteiNID, Partei, WahlkreisNID, Wahlkreis, ParteiStimmenNID, BundeslandStimmen, \
    BundeslandStimmenNID


def parse_to_int(value):
    if value is None:
        return 0
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.strip():  # Check if it's a non-empty string
        return int(value)
    return 0  # Default case


load_dotenv()

year: int = 2021
url: str = os.getenv("_SUPABASE_URL")
key: str = os.getenv("_SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

# get Wahlen
wahl_raw = supabase.table("wahl").select("*").execute()
wahl_list = [Wahl(**data) for data in wahl_raw.data]
wahl = next(filter(lambda obj: obj.year == year, wahl_list), None)

# get Bundesländer
bundesland_raw = supabase.table("bundesland").select("*").execute()
bundesland_list = [Bundesland(**data) for data in bundesland_raw.data]

with open('data/btw2021_kerg.csv', newline='', encoding='utf8') as csvfile:
    reader = csv.reader(csvfile, delimiter='|')

    csv_data = list(reader)

skip_entries = 2
party_beginning = 19  # column where the first party name os
party_distance = 4  # distance between party names
csv_data = csv_data[skip_entries:]

bundesland_stimmen_dicts = []
wahlkreis_dicts = []
partei_dicts = []
partei_stimmen = []
partei_stimmen_dicts = []

for index, row in enumerate(csv_data):
    entries = str(row[0]).split(';')

    if entries[0] != '':

        if index == 0:
            for party_index, entry in enumerate(entries):

                if party_index >= party_beginning and entries[party_index] != '':
                    partei = ParteiNID(entries[party_index], wahl.wahl_id)

                    partei_dicts.append(partei.to_dict())

        # create bundesland stimmen
        if entries[0] != "Nr" and int(entries[0]) >= 900:
            bundesland = next(filter(lambda bland: bland.identifier == int(entries[0]), bundesland_list), None)

            stimmen = BundeslandStimmenNID(wahl.wahl_id, bundesland.bundesland_id, {
                "erststimmen_endgueltig": parse_to_int(entries[3]),
                "erststimmen_vorperiode": parse_to_int(entries[4]),
                "zweitstimmen_endgueltig": parse_to_int(entries[5]),
                "zweitstimmen_vorperiode": parse_to_int(entries[6]),
            }, {
                                               "erststimmen_endgueltig": parse_to_int(entries[7]),
                                               "erststimmen_vorperiode": parse_to_int(entries[8]),
                                               "zweitstimmen_endgueltig": parse_to_int(entries[9]),
                                               "zweitstimmen_vorperiode": parse_to_int(entries[10]),
                                           }, {
                                               "erststimmen_endgueltig": parse_to_int(entries[11]),
                                               "erststimmen_vorperiode": parse_to_int(entries[12]),
                                               "zweitstimmen_endgueltig": parse_to_int(entries[13]),
                                               "zweitstimmen_vorperiode": parse_to_int(entries[14]),
                                           }, {
                                               "erststimmen_endgueltig": parse_to_int(entries[15]),
                                               "erststimmen_vorperiode": parse_to_int(entries[16]),
                                               "zweitstimmen_endgueltig": parse_to_int(entries[17]),
                                               "zweitstimmen_vorperiode": parse_to_int(entries[18]),
                                           })
            bundesland_stimmen_dicts.append(stimmen.to_dict())

        # create wahlkreis & wahlkreis stimmen
        elif entries[0] != "Nr" and int(entries[0]) < 900:
            bundesland = next(filter(lambda bland: bland.identifier == int(entries[2]), bundesland_list), None)

            wahlkreis = WahlkreisNID(wahl.wahl_id, bundesland.bundesland_id, entries[0], entries[1], {
                "erststimmen_endgueltig": parse_to_int(entries[3]),
                "erststimmen_vorperiode": parse_to_int(entries[4]),
                "zweitstimmen_endgueltig": parse_to_int(entries[5]),
                "zweitstimmen_vorperiode": parse_to_int(entries[6]),
            }, {
                                               "erststimmen_endgueltig": parse_to_int(entries[7]),
                                               "erststimmen_vorperiode": parse_to_int(entries[8]),
                                               "zweitstimmen_endgueltig": parse_to_int(entries[9]),
                                               "zweitstimmen_vorperiode": parse_to_int(entries[10]),
                                           }, {
                                               "erststimmen_endgueltig": parse_to_int(entries[11]),
                                               "erststimmen_vorperiode": parse_to_int(entries[12]),
                                               "zweitstimmen_endgueltig": parse_to_int(entries[13]),
                                               "zweitstimmen_vorperiode": parse_to_int(entries[14]),
                                           }, {
                                               "erststimmen_endgueltig": parse_to_int(entries[15]),
                                               "erststimmen_vorperiode": parse_to_int(entries[16]),
                                               "zweitstimmen_endgueltig": parse_to_int(entries[17]),
                                               "zweitstimmen_vorperiode": parse_to_int(entries[18]),
                                           })

            wahlkreis_dicts.append(wahlkreis.to_dict())

            # Partei Stimmen dicts
            p_index = party_beginning
            while p_index < len(entries):
                # TODO change if supporting years with just 2 types of votes instead of 4
                partei_stimme = ParteiStimmenNID(str(csv_data[0]).split(';')[p_index], wahlkreis.identifier, {
                    "erststimmen_endgueltig": parse_to_int(entries[p_index]),
                    "erststimmen_vorperiode": parse_to_int(entries[p_index + 1]),
                    "zweitstimmen_endgueltig": parse_to_int(entries[p_index + 2]),
                    "zweitstimmen_vorperiode": parse_to_int(entries[p_index + 3]),
                })
                partei_stimmen.append(partei_stimme)

                p_index += party_distance

bundesland_response = supabase.table("bundesland_stimmen").insert(bundesland_stimmen_dicts).execute()
wahlkreis_response = supabase.table("wahlkreis").insert(wahlkreis_dicts).execute()
partei_response = supabase.table("partei").insert(partei_dicts).execute()

wahlkreis_response_list = [Wahlkreis(**data) for data in wahlkreis_response.data]
partei_response_list = [Partei(**data) for data in partei_response.data]

for p_stimme in partei_stimmen:
    p_stimme.wahlkreis_id = next(
        filter(lambda obj: obj.identifier == int(p_stimme.wahlkreis_id), wahlkreis_response_list), None).wahlkreis_id
    p_stimme.partei_id = next(filter(lambda obj: obj.name == p_stimme.partei_id, partei_response_list), None).partei_id

    partei_stimmen_dicts.append(p_stimme.to_dict())

partei_stimmen_response = supabase.table("partei_stimmen").insert(partei_stimmen_dicts).execute()

# TODO add function to get stimmen ('' -> 0 etc.)
