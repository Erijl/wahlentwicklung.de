// @ts-nocheck

import {supabase} from "../index.js";
import {Database} from "../../database.types.js";

const getBundeslaender = async (req, res, next) => {
    console.log('REQ: /bundeslaender');
    const { data, error } = await supabase.from('bundesland').select();

    if (error) {
        res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};

export { getBundeslaender };