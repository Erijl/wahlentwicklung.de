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

export const getCleanGeneralElectionData = async (req, res, next) => {
    const { id } = req.params;


    const { data, error } = await supabase
        .from('bundesland_stimmen')
        .select('*')
        .eq('wahl_id', id)
        .eq('bundesland_id', 99);

    if (error || !data) {
        res.status(500).send({ message: error.message });
    }

    const item = data[0];
    const formattedData = {
        wahl_id: item.wahl_id,
        wahlberechtigte: parseInt(item.wahlberechtigte.erststimmen_endgueltig),
        waehler: parseInt(item.waehler.erststimmen_endgueltig),
        ungueltige_stimmen: parseInt(item.ungueltige_stimmen.erststimmen_endgueltig),
        gueltige_stimmen: parseInt(item.gueltige_stimmen.erststimmen_endgueltig)
    };

    res.status(200).send(formattedData);
}