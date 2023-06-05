import { AppDataSource } from "./data-source"
import { DataSource, Equal, getRepository } from "typeorm"
import * as dotenv from 'dotenv'
import { Bundesland, Wahl, Wahlkreis } from "./entity/databaseEntities"
import { parseCSVData } from "./data-reader/data-parser"

dotenv.config()

console.log("Connecting to Database...")

AppDataSource.initialize().then(async () => {
    console.log("DONE");

    const repo = AppDataSource.manager.getRepository(Wahl);

    const filePath = './data-files/btw2013_kerg.csv'
    const returnValue = await parseCSVData(filePath, AppDataSource);

    const bundesländer = returnValue[0];
    const wahlkreis = returnValue[1];

    console.log(bundesländer);
    //for(const bundesland of bundesländer) {
    //    await AppDataSource.manager.save(bundesland);
    //}
    await AppDataSource.manager.save(bundesländer);
    await AppDataSource.manager.save(wahlkreis);

/*

    //const temp = await processCSVFile(testFile);
    //console.log(temp);
    //await addYears();
    
    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")
*/
    

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