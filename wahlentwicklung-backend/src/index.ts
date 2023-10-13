import * as dotenv from 'dotenv'
import express from 'express'
import { createClient } from '@supabase/supabase-js'


dotenv.config();
const app = express();
const PORT = process.env.PORT;
const supabase = createClient(process.env._SUPABASE_URL, process.env._SUPABASE_SERVICE_KEY)

app.use(express.json());

app.get('/wahl', (req, res) => {
    console.log('REQ: /wahl');

    res.status(200).send({
        year: 2021,
        id: 16
    })
});

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