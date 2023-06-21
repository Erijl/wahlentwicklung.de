// @ts-nocheck

import { AppDataSource } from "./data-source"
import { DataSource, Equal, getRepository } from "typeorm"
import * as dotenv from 'dotenv'
import { Bundesland, Party, VoteCounts, Wahl, Wahlkreis } from "./entity/databaseEntities"
import { parseCSVData } from "./data-reader/data-parser"


dotenv.config()

console.log("Connecting to Database...")

AppDataSource.initialize().then(async () => {
    console.log("DONE");

    //dropData();

    const repo = AppDataSource.manager.getRepository(Wahl);

    console.log('Reading File...')
    const filePath = './data-files/btw2017_kerg.csv'
    const returnValue = await parseCSVData(filePath, AppDataSource);

    const bundesländer = returnValue[0];
    const wahlkreise = returnValue[1];
    console.log("DONE");

    //console.log(bundesländer);

    await AppDataSource.manager.save(bundesländer);

    // Adding referencial integretiy between Bundesland <-> Wahlkreis
    for(const wahlkreis of wahlkreise) {
        const bundeslandRepository = AppDataSource.manager.getRepository(Bundesland);
        const bundesland = await bundeslandRepository.findOne({ 
            where: { 
                identifier: wahlkreis.bundesland.identifier,
                bundestagswahl: wahlkreis.bundestagswahl
         } });
         wahlkreis.bundesland = bundesland;
    }
    await AppDataSource.manager.save(wahlkreise);

    for(const vote: VoteCounts[] of wahlkreise[0].voteCounts) {
        await AppDataSource.manager.save(vote.party);
    }    

    // adding referecial inegrity to voteCounts
    let cached: bool = false;
    let cachedParties: Party[] = [];
    const wahlkreisRepository = AppDataSource.manager.getRepository(Wahlkreis)

    for(let i: number = 0; i < wahlkreise.length; i++) {
        const wahlkreis = await wahlkreisRepository.findOne({ 
            where: { 
                identifier: wahlkreise[i].identifier,
                bundestagswahl: vote.bundestagswahl                
         } });

        for(const vote: VoteCounts[] of wahlkreise[i].voteCounts) {
            
            vote.wahlkreis = wahlkreis;

            if(!cached) {
                const partyRepository = AppDataSource.manager.getRepository(Party);
                const party = await partyRepository.findOne({ 
                    where: { 
                        name: vote.party.name,
                        bundestagswahl: vote.bundestagswahl                
                 } });
                 cachedParties.push(party);
                 vote.party = party;
            } else {
                vote.party = cachedParties.find(party => party.name == vote.party.name) ?? '';
            }
            

        }
        cached = true;
        console.log(`${i}/${wahlkreise.length}`)
    }

    
    for(const wahlkreis of wahlkreise) {
        await AppDataSource.manager.save(wahlkreis.voteCounts);
    }

    console.log('DONE')

}).catch(error => console.log(error))


async function addYears() {
    const years = ["1949", "1953", "1953", "1957", "1961", "1965", "1969", "1972", "1976", "1980", "1983", "1987", "1990", "1994", "1998", "2002", "2005", "2009", "2013", "2017", "2021", "2025"]

    for(let i = 0; i < years.length; i++) {
        let election = new Wahl();
        console.log(years[i]);
        election.year = parseInt(years[i]);
        await AppDataSource.manager.save(election);
    }
}

async function dropData() {
    const partyRepository = AppDataSource.manager.getRepository(Party);
await partyRepository.createQueryBuilder().delete().execute();

const voteCountsRepository = AppDataSource.manager.getRepository(VoteCounts);
await voteCountsRepository.createQueryBuilder().delete().execute();

const wahlkreisRepository = AppDataSource.manager.getRepository(Wahlkreis);
await wahlkreisRepository.createQueryBuilder().delete().execute();

const bundeslandRepository = AppDataSource.manager.getRepository(Bundesland);
await bundeslandRepository.createQueryBuilder().delete().execute();
}