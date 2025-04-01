import { GetStaticPaths } from 'next';
import { getElectionById, getAllElectionIds, getElectionBaseResultByYear } from '../../../lib/db';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default async function ElectionPage({params}) {
    await params;
    const election = await getElectionById(params.id);

    const electionBaseResult = await getElectionBaseResultByYear(params.id);
    console.log(electionBaseResult)
    //if (!election) {
    //    return <div>Election not found</div>;
    //}

    const voterTurnout = ((electionBaseResult.actualvoters_primaryvote_definitiv / electionBaseResult.eligiblevoters_primaryvote_definitiv) * 100).toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2});
    return (
        <div>
            <h1>Election Year: {election.year}</h1>
            <h2>{voterTurnout}%
                turnout</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Bundestagswahl {election.year}</CardTitle>
                    <CardDescription>Unglaublich!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Wahlbeteiligung {voterTurnout}%</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>


    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const ids = await getAllElectionIds();
    const paths = ids.map(id => ({id: id.toString()}));

    return {paths, fallback: false};
};

export async function generateMetadata({params}) {
    const election = await getElectionById(params.id);

    return {
        title: "specific title"
    }
}
