import {supabase} from "../index.js";

export const getWahlkreise = async (req, res, next) => {
    const { id } = req.params;

    const { data, error } = await supabase.from('wahlkreis').select('*').eq('wahl_id', id)

    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};