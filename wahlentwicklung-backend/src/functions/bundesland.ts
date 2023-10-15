import {supabase} from "../index.js";

export const getBundeslaender = async (req, res, next) => {
    const { data, error } = await supabase.from('bundesland').select('*');

    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};