class Bundesland:
    def __init__(self, bundesland_id, name, identifier, abbreviation):
        self.bundesland_id = bundesland_id
        self.name = name
        self.identifier = identifier
        self.abbreviation = abbreviation


class ParteiNID:
    def __init__(self, name, wahl_id):
        self.name = name
        self.wahl_id = wahl_id

    def to_dict(self):
        return {
            "name": self.name,
            "wahl_id": self.wahl_id
        }


class Partei:
    def __init__(self, partei_id, name, wahl_id):
        self.partei_id = partei_id
        self.name = name
        self.wahl_id = wahl_id


class ParteiStimmenNID:
    def __init__(self, partei_id, wahlkreis_id, stimmen):
        self.partei_id = partei_id
        self.wahlkreis_id = wahlkreis_id
        self.stimmen = stimmen

    def to_dict(self):
        return {
            "partei_id": self.partei_id,
            "wahlkreis_id": self.wahlkreis_id,
            "stimmen": self.stimmen
        }


class Wahl:
    def __init__(self, wahl_id, year, active):
        self.wahl_id = wahl_id
        self.year = year
        self.active = active


class WahlkreisNID:
    def __init__(self, wahl_id, bundesland_id, identifier, name, wahlberechtigte, waehler, ungueltige_stimmen, gueltige_stimmen):
        self.wahl_id = wahl_id
        self.bundesland_id = bundesland_id
        self.identifier = identifier
        self.name = name
        self.wahlberechtigte = wahlberechtigte
        self.waehler = waehler
        self.ungueltige_stimmen = ungueltige_stimmen
        self.gueltige_stimmen = gueltige_stimmen

    def to_dict(self):
        return {
            "wahl_id": self.wahl_id,
            "bundesland_id": self.bundesland_id,
            "identifier": self.identifier,
            "name": self.name,
            "wahlberechtigte": self.wahlberechtigte,
            "waehler": self.waehler,
            "ungueltige_stimmen": self.ungueltige_stimmen,
            "gueltige_stimmen": self.gueltige_stimmen
        }


class Wahlkreis:
    def __init__(self, wahlkreis_id, wahl_id, bundesland_id, identifier, name, wahlberechtigte, waehler, ungueltige_stimmen, gueltige_stimmen):
        self.wahlkreis_id = wahlkreis_id
        self.wahl_id = wahl_id
        self.bundesland_id = bundesland_id
        self.identifier = identifier
        self.name = name
        self.wahlberechtigte = wahlberechtigte
        self.waehler = waehler
        self.ungueltige_stimmen = ungueltige_stimmen
        self.gueltige_stimmen = gueltige_stimmen


class BundeslandStimmen:
    def __init__(self, bundesland_stimmen_id, wahl_id, bundesland_id, wahlberechtigte, waehler, ungueltige_stimmen, gueltige_stimmen):
        self.bundesland_stimmen_id = bundesland_stimmen_id
        self.wahl_id = wahl_id
        self.bundesland_id = bundesland_id
        self.wahlberechtigte = wahlberechtigte
        self.waehler = waehler
        self.ungueltige_stimmen = ungueltige_stimmen
        self.gueltige_stimmen = gueltige_stimmen


class BundeslandStimmenNID:
    def __init__(self, wahl_id, bundesland_id, wahlberechtigte, waehler, ungueltige_stimmen, gueltige_stimmen):
        self.wahl_id = wahl_id
        self.bundesland_id = bundesland_id
        self.wahlberechtigte = wahlberechtigte
        self.waehler = waehler
        self.ungueltige_stimmen = ungueltige_stimmen
        self.gueltige_stimmen = gueltige_stimmen

    def to_dict(self):
        return {
            "wahl_id": self.wahl_id,
            "bundesland_id": self.bundesland_id,
            "wahlberechtigte": self.wahlberechtigte,
            "waehler": self.waehler,
            "ungueltige_stimmen": self.ungueltige_stimmen,
            "gueltige_stimmen": self.gueltige_stimmen
        }