import {supabase} from "../index.js";

export const getBundeslaender = async (req, res, next) => {
    const { data, error } = await supabase.from('bundesland').select('*');

    if (error) {
        return res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};

export const getBundeslandWahlResult = async (req, res, next) => {
    const { wahlId, bundeslandId } = req.params;

    const { data, error } = await supabase.rpc('getbundeslandelectionresults', { p_wahl_id: wahlId, p_bundesland_id: bundeslandId });
    console.log('req bundeslandWahlResult')
    if (error) {
        return res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
}
