-- parties
-- 2005 name with trailing dot
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Die Linke')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Die Linke.');

-- different short form
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'PARTEI MENSCH UMWELT TIERSCHUTZ')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Die Tierschutzpartei');


-- different short form
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Ökologisch-Demokratische Partei')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'ödp');


-- name variant
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Ab jetzt...Demokratie durch Volksabstimmung - Politik für die Menschen')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Ab jetzt...Demokratie durch Volksabstimmung');

-- name variant
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'bergpartei, die überpartei - ökoanarchistisch-realdadaistisches sammelbecken')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'bergpartei, die überpartei');

-- name variant
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Menschliche Welt - für das Wohl und Glücklichsein aller')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Menschliche Welt');

-- renamed 2019
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Gartenpartei')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Magdeburger Gartenpartei');

-- short form
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'UNABHÄNGIGE für bürgernahe Demokratie')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'UNABHÄNGIGE');

-- word order variant
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Team Todenhöfer – Die Gerechtigkeitspartei')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Die Gerechtigkeitspartei – Team Todenhöfer');

-- renamed 2024 (suffix added)
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Ökologisch-Demokratische Partei')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Ökologisch-Demokratische Partei - Die Naturschutzpartei');

-- renamed 2024
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Partei für Gesundheitsforschung')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Partei für Verjüngungsforschung');

-- suffix variant
UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Partei der Humanisten')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Partei der Humanisten - Fakten, Freiheit, Fortschritt');

UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'Bündnis Sahra Wagenknecht - Vernunft und Gerechtigkeit')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'Bündnis Sahra Wagenknecht - Vernunft und Gerechtigkeit');

UPDATE party_mapping
SET party_id = (SELECT id FROM party WHERE name = 'DIE REPUBLIKANER')
WHERE party_id IS NULL
  AND (election_year, column_index) IN
      (SELECT election_year, column_index FROM election_party WHERE name = 'REP');

-- constituencies

UPDATE constituency_mapping
SET constituency_id = 163 -- Aalen – Heidenheim
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Aalen - Heidenheim');

UPDATE constituency_mapping
SET constituency_id = 18 -- Aurich – Emden
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Aurich - Emden');

UPDATE constituency_mapping
SET constituency_id = 162 -- Backnang – Schwäbisch Gmünd
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Backnang - Schwäbisch Gmünd');

UPDATE constituency_mapping
SET constituency_id = 244 -- Berlin-Charlottenburg-Wilmersdorf
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Charlottenburg - Wilmersdorf');

UPDATE constituency_mapping
SET constituency_id = 247 -- Berlin-Friedrichshain-Kreuzberg – Prenzlauer Berg Ost
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Friedrichshain - Kreuzberg - Prenzlauer Berg Ost');

UPDATE constituency_mapping
SET constituency_id = 247 -- Berlin-Friedrichshain-Kreuzberg – Prenzlauer Berg Ost
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Friedrichshain-Kreuzberg - Prenzlauer Berg Ost');

UPDATE constituency_mapping
SET constituency_id = 249 -- Berlin-Marzahn-Hellersdorf
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Marzahn - Hellersdorf');

UPDATE constituency_mapping
SET constituency_id = 242 -- Berlin-Spandau – Charlottenburg Nord
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Spandau - Charlottenburg Nord');

UPDATE constituency_mapping
SET constituency_id = 243 -- Berlin-Steglitz-Zehlendorf
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Steglitz - Zehlendorf');

UPDATE constituency_mapping
SET constituency_id = 245 -- Berlin-Tempelhof-Schöneberg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Tempelhof - Schöneberg');

UPDATE constituency_mapping
SET constituency_id = 248 -- Berlin-Treptow-Köpenick
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Berlin-Treptow - Köpenick');

UPDATE constituency_mapping
SET constituency_id = 95 -- Bielefeld – Gütersloh II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Bielefeld - Gütersloh II');

UPDATE constituency_mapping
SET constituency_id = 88 -- Bottrop – Recklinghausen III
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Bottrop - Recklinghausen III');

UPDATE constituency_mapping
SET constituency_id = 255 -- Brandenburg an der Havel – Potsdam-Mittelmark I – Havelland III – Teltow-Fläming I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Brandenburg an der Havel - Potsdam-Mittelmark I - Havelland III - Teltow-Fläming I');

UPDATE constituency_mapping
SET constituency_id = 49 -- Bremen II – Bremerhaven
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Bremen II - Bremerhaven');

UPDATE constituency_mapping
SET constituency_id = 171 -- Bruchsal – Schwetzingen
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Bruchsal - Schwetzingen');

UPDATE constituency_mapping
SET constituency_id = 290 -- Burgenland – Saalekreis
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Burgenland - Saalekreis');

UPDATE constituency_mapping
SET constituency_id = 284 -- Börde – Jerichower Land
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Börde - Jerichower Land');

UPDATE constituency_mapping
SET constituency_id = 38 -- Celle – Uelzen
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Celle - Uelzen');

UPDATE constituency_mapping
SET constituency_id = 279 -- Chemnitzer Umland – Erzgebirgskreis II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Chemnitzer Umland - Erzgebirgskreis II');

UPDATE constituency_mapping
SET constituency_id = 26 -- Cloppenburg – Vechta
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Cloppenburg - Vechta');

UPDATE constituency_mapping
SET constituency_id = 90 -- Coesfeld – Steinfurt II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Coesfeld - Steinfurt II');

UPDATE constituency_mapping
SET constituency_id = 259 -- Cottbus – Spree-Neiße
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Cottbus - Spree-Neiße');

UPDATE constituency_mapping
SET constituency_id = 23 -- Cuxhaven – Stade II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Cuxhaven - Stade II');

UPDATE constituency_mapping
SET constituency_id = 257 -- Dahme-Spreewald – Teltow-Fläming III – Oberspreewald-Lausitz I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Dahme-Spreewald - Teltow-Fläming III - Oberspreewald-Lausitz I');

UPDATE constituency_mapping
SET constituency_id = 22 -- Delmenhorst – Wesermarsch – Oldenburg-Land
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Delmenhorst - Wesermarsch - Oldenburg-Land');

UPDATE constituency_mapping
SET constituency_id = 287 -- Dessau – Wittenberg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Dessau - Wittenberg');

UPDATE constituency_mapping
SET constituency_id = 27 -- Diepholz – Nienburg I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Diepholz - Nienburg I');

UPDATE constituency_mapping
SET constituency_id = 276 -- Dresden II – Bautzen II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Dresden II - Bautzen II');

UPDATE constituency_mapping
SET constituency_id = 260 -- Elbe-Elster – Oberspreewald-Lausitz II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Elbe-Elster - Oberspreewald-Lausitz II');

UPDATE constituency_mapping
SET constituency_id = 176 -- Emmendingen – Lahr
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Emmendingen - Lahr');

UPDATE constituency_mapping
SET constituency_id = 190 -- Erding – Ebersberg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Erding - Ebersberg');

UPDATE constituency_mapping
SET constituency_id = 296 -- Erfurt – Weimar – Weimarer Land II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Erfurt - Weimar - Weimarer Land II');

UPDATE constituency_mapping
SET constituency_id = 55 -- Euskirchen – Rhein-Erft-Kreis II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Euskirchen - Rhein-Erft-Kreis II');

UPDATE constituency_mapping
SET constituency_id = 1 -- Flensburg – Schleswig
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Flensburg - Schleswig');

UPDATE constituency_mapping
SET constituency_id = 258 -- Frankfurt (Oder) – Oder-Spree
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Frankfurt (Oder) - Oder-Spree');

UPDATE constituency_mapping
SET constituency_id = 20 -- Friesland – Wilhelmshaven – Wittmund
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Friesland - Wilhelmshaven - Wittmund');

UPDATE constituency_mapping
SET constituency_id = 39 -- Gifhorn – Peine
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Gifhorn - Peine');

UPDATE constituency_mapping
SET constituency_id = 46 -- Goslar – Northeim – Osterode
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Goslar - Northeim - Osterode');

UPDATE constituency_mapping
SET constituency_id = 295 -- Gotha – Ilm-Kreis
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Gotha - Ilm-Kreis');

UPDATE constituency_mapping
SET constituency_id = 101 -- Hagen – Ennepe-Ruhr-Kreis I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Hagen - Ennepe-Ruhr-Kreis I');

UPDATE constituency_mapping
SET constituency_id = 17 -- Hamburg-Bergedorf – Harburg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Hamburg-Bergedorf - Harburg');

UPDATE constituency_mapping
SET constituency_id = 40 -- Hameln-Pyrmont – Holzminden
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Hameln-Pyrmont - Holzminden');

UPDATE constituency_mapping
SET constituency_id = 108 -- Hamm – Unna II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Hamm - Unna II');

UPDATE constituency_mapping
SET constituency_id = 45 -- Helmstedt – Wolfsburg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Helmstedt - Wolfsburg');

UPDATE constituency_mapping
SET constituency_id = 96 -- Herford – Minden-Lübbecke II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Herford - Minden-Lübbecke II');

UPDATE constituency_mapping
SET constituency_id = 104 -- Herne – Bochum II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Herne - Bochum II');

UPDATE constituency_mapping
SET constituency_id = 10 -- Herzogtum Lauenburg – Stormarn-Süd
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Herzogtum Lauenburg - Stormarn-Süd');

UPDATE constituency_mapping
SET constituency_id = 73 -- Krefeld I – Neuss II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Krefeld I - Neuss II');

UPDATE constituency_mapping
SET constituency_id = 77 -- Krefeld II – Wesel II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Krefeld II - Wesel II');

UPDATE constituency_mapping
SET constituency_id = 64 -- Leverkusen – Köln IV
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Leverkusen - Köln IV');

UPDATE constituency_mapping
SET constituency_id = 262 -- Ludwigslust-Parchim II – Nordwestmecklenburg II – Landkreis Rostock I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Ludwigslust-Parchim II - Nordwestmecklenburg II - Landkreis Rostock I');

UPDATE constituency_mapping
SET constituency_id = 175 -- Lörrach – Müllheim
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Lörrach - Müllheim');

UPDATE constituency_mapping
SET constituency_id = 31 -- Lüchow-Dannenberg – Lüneburg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Lüchow-Dannenberg - Lüneburg');

UPDATE constituency_mapping
SET constituency_id = 122 -- Main-Kinzig – Wetterau II – Schotten
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Main-Kinzig - Wetterau II - Schotten');

UPDATE constituency_mapping
SET constituency_id = 265 -- Mecklenburgische Seenplatte I – Vorpommern-Greifswald II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Mecklenburgische Seenplatte I - Vorpommern-Greifswald II');

UPDATE constituency_mapping
SET constituency_id = 266 -- Mecklenburgische Seenplatte II – Landkreis Rostock III
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Mecklenburgische Seenplatte II - Landkreis Rostock III');

UPDATE constituency_mapping
SET constituency_id = 254 -- Märkisch-Oderland – Barnim II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Märkisch-Oderland - Barnim II');

UPDATE constituency_mapping
SET constituency_id = 81 -- Mülheim – Essen I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Mülheim - Essen I');

UPDATE constituency_mapping
SET constituency_id = 147 -- Neustadt – Speyer
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Neustadt - Speyer');

UPDATE constituency_mapping
SET constituency_id = 34 -- Nienburg II – Schaumburg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Nienburg II - Schaumburg');

UPDATE constituency_mapping
SET constituency_id = 2 -- Nordfriesland – Dithmarschen Nord
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Nordfriesland - Dithmarschen Nord');

UPDATE constituency_mapping
SET constituency_id = 80 -- Oberhausen – Wesel III
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Oberhausen - Wesel III');

UPDATE constituency_mapping
SET constituency_id = 253 -- Oberhavel – Havelland II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Oberhavel - Havelland II');

UPDATE constituency_mapping
SET constituency_id = 169 -- Odenwald – Tauber
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Odenwald - Tauber');

UPDATE constituency_mapping
SET constituency_id = 21 -- Oldenburg – Ammerland
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Oldenburg - Ammerland');

UPDATE constituency_mapping
SET constituency_id = 112 -- Olpe – Märkischer Kreis I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Olpe - Märkischer Kreis I');

UPDATE constituency_mapping
SET constituency_id = 28 -- Osterholz – Verden
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Osterholz - Verden');

UPDATE constituency_mapping
SET constituency_id = 9 -- Ostholstein – Stormarn-Nord
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Ostholstein - Stormarn-Nord');

UPDATE constituency_mapping
SET constituency_id = 6 -- Plön – Neumünster
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Plön - Neumünster');

UPDATE constituency_mapping
SET constituency_id = 256 -- Potsdam – Potsdam-Mittelmark II – Teltow-Fläming II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Potsdam - Potsdam-Mittelmark II - Teltow-Fläming II');

UPDATE constituency_mapping
SET constituency_id = 251 -- Prignitz – Ostprignitz-Ruppin – Havelland I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Prignitz - Ostprignitz-Ruppin - Havelland I');

UPDATE constituency_mapping
SET constituency_id = 125 -- Rheingau-Taunus – Limburg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Rheingau-Taunus - Limburg');

UPDATE constituency_mapping
SET constituency_id = 263 -- Rostock – Landkreis Rostock II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Rostock - Landkreis Rostock II');

UPDATE constituency_mapping
SET constituency_id = 29 -- Rotenburg I – Heidekreis
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Rotenburg I - Heidekreis');

UPDATE constituency_mapping
SET constituency_id = 178 -- Rottweil – Tuttlingen
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Rottweil - Tuttlingen');

UPDATE constituency_mapping
SET constituency_id = 43 -- Salzgitter – Wolfenbüttel
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Salzgitter - Wolfenbüttel');

UPDATE constituency_mapping
SET constituency_id = 261 -- Schwerin – Ludwigslust-Parchim I – Nordwestmecklenburg I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Schwerin - Ludwigslust-Parchim I - Nordwestmecklenburg I');

UPDATE constituency_mapping
SET constituency_id = 161 -- Schwäbisch Hall – Hohenlohe
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Schwäbisch Hall - Hohenlohe');

UPDATE constituency_mapping
SET constituency_id = 8 -- Segeberg – Stormarn-Mitte
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Segeberg - Stormarn-Mitte');

UPDATE constituency_mapping
SET constituency_id = 66 -- Solingen – Remscheid – Wuppertal II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Solingen - Remscheid - Wuppertal II');

UPDATE constituency_mapping
SET constituency_id = 24 -- Stade I – Rotenburg II
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Stade I - Rotenburg II');

UPDATE constituency_mapping
SET constituency_id = 3 -- Steinburg – Dithmarschen Süd
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Steinburg - Dithmarschen Süd');

UPDATE constituency_mapping
SET constituency_id = 87 -- Steinfurt I – Borken I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Steinfurt I - Borken I');

UPDATE constituency_mapping
SET constituency_id = 274 -- Sächsische Schweiz-Osterzgebirge
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Sächsische Schweiz - Osterzgebirge');

UPDATE constituency_mapping
SET constituency_id = 252 -- Uckermark – Barnim I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Uckermark - Barnim I');

UPDATE constituency_mapping
SET constituency_id = 264 -- Vorpommern-Rügen – Vorpommern-Greifswald I
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Vorpommern-Rügen - Vorpommern-Greifswald I');

UPDATE constituency_mapping
SET constituency_id = 116 -- Werra-Meißner – Hersfeld-Rotenburg
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Werra-Meißner - Hersfeld-Rotenburg');

UPDATE constituency_mapping
SET constituency_id = 188 -- Zollernalb – Sigmaringen
WHERE constituency_id IS NULL
  AND (election_year, election_state_id, row_id) IN
      (SELECT election_year, state_id, row_id FROM election_constituency WHERE name = 'Zollernalb - Sigmaringen');

-- seat corrections (audit §4): the kerg source rows carry no/wrong seat
-- counts for these cases; official results per Bundeswahlleiterin:
-- SSW holds 1 seat in 2021 and 2025, FDP holds 92 seats in 2021 (not 91).
UPDATE election_party
SET seat_count = 1
WHERE seat_count = 0
  AND (election_year, column_index) IN
      (SELECT pm.election_year, pm.column_index
       FROM party_mapping pm
       JOIN party p ON p.id = pm.party_id
       WHERE p.abbreviation = 'SSW' AND pm.election_year IN (2021, 2025));

UPDATE election_party
SET seat_count = 92
WHERE (election_year, column_index) IN
      (SELECT pm.election_year, pm.column_index
       FROM party_mapping pm
       JOIN party p ON p.id = pm.party_id
       WHERE p.abbreviation = 'FDP' AND pm.election_year = 2021);

-- ---------------------------------------------------------------------------
-- Election dates (v0.4 leftover; verified against Bundeswahlleiterin)
-- ---------------------------------------------------------------------------

UPDATE election SET date = '2005-09-18' WHERE year = 2005;
UPDATE election SET date = '2009-09-27' WHERE year = 2009;
UPDATE election SET date = '2013-09-22' WHERE year = 2013;
UPDATE election SET date = '2017-09-24' WHERE year = 2017;
UPDATE election SET date = '2021-09-26' WHERE year = 2021;
UPDATE election SET date = '2025-02-23' WHERE year = 2025;
