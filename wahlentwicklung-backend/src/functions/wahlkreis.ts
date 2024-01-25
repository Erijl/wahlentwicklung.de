import {supabase} from "../index.js";

export const getWahlkreise = async (req, res, next) => {
    const { id } = req.params;

    const { data, error } = await supabase.from('district').select('*').eq('election_id', id);

    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};