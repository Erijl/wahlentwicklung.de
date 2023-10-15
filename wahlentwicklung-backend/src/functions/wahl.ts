import {supabase} from "../index.js";

export const getWahlen = async (req, res, next) => {
    const { data, error } = await supabase.from('wahl').select('*').eq('active', 'true');

    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};