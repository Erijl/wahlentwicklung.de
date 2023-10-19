import {supabase} from "../index.js";

export const getWahlen = async (req, res, next) => {
    const { data, error } = await supabase.from('wahl').select('*').eq('active', 'true');

    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};

export const getWahlResult = async (req, res, next) => {
    const { id } = req.params;

    const { data, error } = await supabase.rpc('getelectionresults', { p_wahl_id: id });
    console.log('req wahlResult')
    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
}