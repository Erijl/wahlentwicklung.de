import {supabase} from "../index.js";

export const getWahlen = async (req, res, next) => {
    const { data, error } = await supabase.from('election').select('*').eq('active', 'true');

    if (error) {
        return res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
};

export const getWahlResult = async (req, res, next) => {
    const { id } = req.params;

    const { data, error } = await supabase.rpc('getelectionresults', { p_election_id: id });
    console.log('req wahlResult')
    if (error) {
        return res.status(500).send({ message: error.message });
    }

    res.status(200).send(data);
}

export const getCleanGeneralElectionData = async (req, res, next) => {
    const { id } = req.params;


    const { data, error } = await supabase
        .from('state_votes')
        .select('*')
        .eq('election_id', id)
        .eq('state_id', 99);

    if (error || !data) {
        return res.status(500).send({ message: error.message });
    }

    const item = data[0];
    const formattedData = {
        election_id: item.election_id,
        eligible_voters: parseInt(item.eligible_voters.primary_votes_final),
        voters: parseInt(item.voters.primary_votes_final),
        invalid_votes: parseInt(item.invalid_votes.primary_votes_final),
        valid_votes: parseInt(item.valid_votes.primary_votes_final)
    };

    res.status(200).send(formattedData);
}