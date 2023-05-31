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
    console.log(rows[2]);
    console.log(rows.length);
    console.log(rows[rows.length-1]);

  } catch (error) {
    console.error('Error reading CSV file:', error);
    throw error;
  }
}