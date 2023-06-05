import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Bundesland, Party, VoteCounts, Wahl, Wahlkreis } from '../entity/databaseEntities';

function readCSVFile(filePath: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const rows: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const row = Object.values(data).join(';');
        rows.push(row);
      })
      .on('end', () => resolve(rows))
      .on('error', (error) => reject(error));
  });
}

export async function parseCSVData(filePath: string): Promise<void> {
  try {
    const rows = await readCSVFile(filePath);
    const year = parseInt(filePath.replace(/^.*[\\\/]/, '').replace('btw', '').replace('_kerg.csv', ''));
    //TODO Replace with database search based of year
    let bundestagswahl = new Wahl()
    bundestagswahl.year = year;

    let bundesländer: Bundesland[] = [];
    //console.log(rows[rows.length-1].split(';'));
    for(let row of rows) {
      let entries: string[] = row.split(';');
      const identifier = parseInt(entries[0]);
      if(identifier < 900){
        // Wahlkreis

        
      } else if(identifier > 900 && identifier != 999){
        // Bundesland

        let bundesland = new Bundesland();

        bundesland.identifier = identifier-900;
        bundesland.name = entries[1];
        bundesland.bundestagswahl = bundestagswahl;

        bundesländer.push(bundesland);
      }

    }

    console.log(bundesländer);
  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}