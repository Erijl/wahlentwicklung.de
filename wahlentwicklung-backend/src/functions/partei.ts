import {supabase} from "../index.js";

export const getParteien = async (req, res, next) => {
    const { data, error } = await supabase.from('partei').select('*').eq('wahl_id', '21');

    if (error) {
        return res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};