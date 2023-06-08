import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Bundesland, Party, VoteCounts, Wahl, Wahlkreis } from '../entity/databaseEntities';

function readCSVFile(filePath: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const rows: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ headers: false }))
      .on('data', (data) => {
        const row = Object.values(data).join(';');
        rows.push(row);
      })
      .on('end', () => resolve(rows))
      .on('error', (error) => reject(error));
  });
}

export async function parseCSVData(filePath: string, AppDataSource) {
  try {
    const rows = await readCSVFile(filePath);
    const year = parseInt(filePath.replace(/^.*[\\\/]/, '').replace('btw', '').replace('_kerg.csv', ''));
    //TODO Replace with database search based of year
    const wahlRepository = AppDataSource.manager.getRepository(Wahl);
    const bundestagswahl = await wahlRepository.findOne({ where: { year: 2013 } });

    let bundesländer: Bundesland[] = [];
    let wahlkreise: Wahlkreis[] = [];
    //console.log(rows[rows.length-1].split(';'));
    const headerRow: string[] = rows[0].split(';');
    
    for(let row of rows) {
      let entries: string[] = row.split(';');
      const identifier = parseInt(entries[0]);
      if(identifier < 900){
        // Wahlkreis

        let wahlkreis = new Wahlkreis();

        wahlkreis.name = entries[1];
        wahlkreis.identifier = parseInt(entries[2]);

        wahlkreis.wahlberechtigte_endgueltig = parseNumber(entries[3]);
        wahlkreis.wahlberechtigte_vorperiode = parseNumber(entries[4]);

        wahlkreis.waehler_endgueltig = parseNumber(entries[7]);
        wahlkreis.waehler_vorperiode = parseNumber(entries[8]);

        wahlkreis.ungueltige_erststimmen_endgueltig = parseNumber(entries[11]);
        wahlkreis.ungueltige_erststimmen_vorperiode = parseNumber(entries[12]);

        wahlkreis.ungueltige_zweitstimmen_endgueltig = parseNumber(entries[13]);
        wahlkreis.ungueltige_zweitstimmen_vorperiode = parseNumber(entries[14]);

        wahlkreis.gueltige_erststimmen_endgueltig = parseNumber(entries[15]);
        wahlkreis.gueltige_erststimmen_vorperiode = parseNumber(entries[16]);

        wahlkreis.gueltige_zweitstimmen_endgueltig = parseNumber(entries[17]);
        wahlkreis.gueltige_zweitstimmen_vorperiode = parseNumber(entries[18]);

        wahlkreis.bundestagswahl = bundestagswahl;

        const voteCounts: VoteCounts[] = [];

        for(let i: number = 19; i < entries.length; i+=4) {
          let vote = new VoteCounts();

          vote.bundestagswahl = bundestagswahl;
          vote.wahlkreis = wahlkreis;

          let party = new Party();
          party.bundestagswahl = bundestagswahl;
          party.name = headerRow[i];

          vote.party = party;

          vote.erststimmen_endgueltig = parseNumber(entries[i]);
          vote.erststimmen_vorperiode = parseNumber(entries[i+1]);

          vote.zweitstimmen_endgueltig = parseNumber(entries[i+2]);
          vote.zweitstimmen_vorperiode = parseNumber(entries[i+3]);

          if(party.name && party.name !== '' && party.name !== ' '){
            voteCounts.push(vote);
          }
        }

        wahlkreis.voteCounts = voteCounts;

        wahlkreise.push(wahlkreis);
      } else if(identifier > 900 && identifier != 999){
        // Bundesland

        let bundesland = new Bundesland();

        bundesland.identifier = identifier-900;
        bundesland.name = entries[1];
        bundesland.bundestagswahl = bundestagswahl;

        bundesländer.push(bundesland);
      }

    }

    //TODO Wahlkreis Idetifier -> Bundesland reference
    for(const wahlKreis of wahlkreise) {
      wahlKreis.bundesland = bundesländer.find(bundesland => bundesland.identifier == wahlKreis.identifier);
    }

    return [ bundesländer, wahlkreise];
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}

function parseNumber(value) {
  if(!value || value === undefined || value === null || value === "") return 0;
  return parseInt(value);
}