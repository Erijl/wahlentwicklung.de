import { AppDataSource } from "./data-source"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'
import { Wahl } from "./entity/databaseEntities"

dotenv.config()

console.log("Connecting to Database...")

AppDataSource.initialize().then(async () => {
    console.log("DONE");


    /*
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
