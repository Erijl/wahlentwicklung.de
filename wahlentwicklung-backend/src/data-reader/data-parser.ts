import * as csvParser from 'csv-parser';
import * as fs from 'fs';


export async function processCSVFile(filePath: string): Promise<ElectionData[]> {
  const data: ElectionData[] = [];
  let lineCounter = 0;

  return new Promise<ElectionData[]>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ',' })) // Specify the separator as a tab character
      .on('data', (row: any) => {
        lineCounter++;

        if (lineCounter > 5) {
          const parties: Record<string, { Erststimmen: number; Zweitstimmen: number }> = {};

          // Iterate over the row keys and identify the party keys dynamically
          Object.keys(row).forEach((key) => {
            if(key.startsWith('#')) return;
            console.log(key);
            if (key !== 'Nr' && key !== 'Gebiet' && key !== 'gehört_zu' && key !== 'Wahlberechtigte' && key !== 'Wähler' && key !== 'Ungültige' && key !== 'Gültige') {
              // Extract the party name from the key
              const partyName = key.split('_')[0];

              // Check if the party already exists in the dictionary
              if (!parties[partyName]) {
                parties[partyName] = {
                  Erststimmen: parseInt(row[`${partyName}_Erststimmen`]),
                  Zweitstimmen: parseInt(row[`${partyName}_Zweitstimmen`]),
                };
              }
            }
          });

          const electionData = new ElectionData(
            parseInt(row.Nr),
            row.Gebiet,
            parseInt(row.gehört_zu),
            parseInt(row.Wahlberechtigte),
            parseInt(row.Wähler),
            parseInt(row.Ungültige),
            parseInt(row.Gültige),
            parties
          );

          data.push(electionData);
        }
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
class ElectionData {
  Nr: number;
  Gebiet: string;
  gehört_zu: number;
  Wahlberechtigte: number;
  Wähler: number;
  Ungültige: number;
  Gültige: number;
  parties: Record<string, { Erststimmen: number; Zweitstimmen: number }>;

  constructor(
    Nr: number,
    Gebiet: string,
    gehört_zu: number,
    Wahlberechtigte: number,
    Wähler: number,
    Ungültige: number,
    Gültige: number,
    parties: Record<string, { Erststimmen: number; Zweitstimmen: number }>
  ) {
    this.Nr = Nr;
    this.Gebiet = Gebiet;
    this.gehört_zu = gehört_zu;
    this.Wahlberechtigte = Wahlberechtigte;
    this.Wähler = Wähler;
    this.Ungültige = Ungültige;
    this.Gültige = Gültige;
    this.parties = parties;
  }
}