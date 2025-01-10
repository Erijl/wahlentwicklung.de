import { GetStaticPaths } from 'next';
import { getElectionById, getAllElectionIds } from '../../../lib/db';

export default async function ElectionPage({params}) {
    const election = await getElectionById(params.id);

    //if (!election) {
    //    return <div>Election not found</div>;
    //}

    return (
        <div>
            <h1>Election Year: {election.year}</h1>
            {/* Add more election details here */}
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const ids = await getAllElectionIds();
    const paths = ids.map(id => ({ id: id.toString() }));

    return { paths, fallback: false };
};

export async function generateMetadata({params}) {
    const election = await getElectionById(params.id);

    return {
        title: "specific title"
    }
}
