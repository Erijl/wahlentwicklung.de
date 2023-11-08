import * as dotenv from 'dotenv'
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import {getBundeslaender, getBundeslandWahlResult} from "./functions/bundesland.js";
import {getParteien} from "./functions/partei.js";
import {getCleanGeneralElectionData, getWahlen, getWahlResult} from "./functions/wahl.js";
import {getWahlkreise} from "./functions/wahlkreis.js";


dotenv.config({ path: process.cwd() + '\\env.env' });
const app = express();
const PORT = process.env.PORT;
export const supabase = createClient(process.env._SUPABASE_URL, process.env._SUPABASE_SERVICE_KEY);


app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.get('/wahlkreise/:id', getWahlkreise);

app.get('/bundeslaender', getBundeslaender);
app.get('/bundesland/result/:wahlId/:bundeslandId', getBundeslandWahlResult)

app.get('/parteien', getParteien);

app.get('/wahlen', getWahlen);
app.get('/wahl/result/:id', getWahlResult);
app.get('/wahl/general/:id', getCleanGeneralElectionData);

app.post('/wahl/:id', (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;

    if (!logo) {
        res.status(418).send({ message: 'We need a body!' });
    }

    res.send({
        id: id,
        body: logo
    })
})

app.listen(
    PORT,
    () => {
        console.log(`it's alive on http://localhost:${PORT}`);
    }
)