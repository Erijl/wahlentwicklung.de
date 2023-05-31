import "reflect-metadata"
import { DataSource } from "typeorm"
import { Bundesland, Party, VoteCounts, Wahl, Wahlkreis } from "./entity/databaseEntities"
import * as dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [Wahl, Party, Bundesland, Wahlkreis, VoteCounts],
    migrations: [],
    subscribers: [],
})
