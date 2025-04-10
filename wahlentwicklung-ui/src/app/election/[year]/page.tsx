import React from 'react';
import {
    getAllElectionYears,
    getPreviousElectionYear,
    getPrimaryVotesForYear,
    getTotalValidPrimaryVotesForYear,
    getElectionByYear, getSeatDistributionForYear, getSeatAndCoalitionDataForYear
} from '@/lib/db';
import ElectionPrimaryVotesChart from '../../../components/ElectionPrimaryVotesChart';
import { lighten } from 'polished';
import { notFound } from 'next/navigation';
import BundestagSeatingChart from "@/components/BundestagSeatingChart";
import CoalitionVisualizations from "@/components/CoalitionVisualizations";

interface PartyVoteData {
    abbreviation: string;
    color: string | null;
    votes: number;
}

interface ChartDataItem {
    abbreviation: string;
    color: string;
    previousColor: string;
    currentPercent: number | null;
    previousPercent: number | null;
}

export async function generateStaticParams() {
    const years = await getAllElectionYears();

    return years.map(year => ({
        year: year.toString(),
    }));
}

interface RawSeatInfo {
    abbreviation: string;
    color: string | null;
    seats: number;
}

interface ProcessedSeatInfo {
    abbreviation: string;
    color: string;
    seats: number;
    change: number | null;
}

interface PartySeatCoalitionData {
    abbreviation: string;
    color: string;
    seats: number;
    inCoalition: boolean;
}

interface ProcessedSeatInfo {
    abbreviation: string;
    color: string;
    seats: number;
    change: number | null;
}

const MIN_PERCENT_THRESHOLD = 0.5;
const DEFAULT_PARTY_COLOR = '#8884d8';
const PREVIOUS_BAR_LIGHTEN_AMOUNT = 0.3;
const SONSTIGE_COLOR = '#cccccc';
const DEFAULT_SEAT_COLOR = 'CCCCCC';

async function ElectionPage({ params }: { params: { year: string } }) {

    const yearStr = params.year;
    const currentYear = parseInt(yearStr, 10);

    if (isNaN(currentYear)) {
        notFound(); //TODO 404 page
    }

    const electionExists = await getElectionByYear(currentYear);
    if (!electionExists) {
        notFound();
    }

    const previousYear = await getPreviousElectionYear(currentYear);

    const currentYearVotesData = await getPrimaryVotesForYear(currentYear);
    const currentYearTotalValidVotes = await getTotalValidPrimaryVotesForYear(currentYear);

    let previousYearVotesData: PartyVoteData[] = [];
    let previousYearTotalValidVotes = 0;
    if (previousYear) {
        previousYearVotesData = await getPrimaryVotesForYear(previousYear);
        previousYearTotalValidVotes = await getTotalValidPrimaryVotesForYear(previousYear);
    }

    const partyDataMap = new Map<string, ChartDataItem>();
    let currentYearSonstigeVotes = currentYearTotalValidVotes;
    let previousYearSonstigeVotes = previousYearTotalValidVotes;

    currentYearVotesData.forEach(party => {
        const percent = currentYearTotalValidVotes > 0 ? (party.votes / currentYearTotalValidVotes) * 100 : 0;
        const color = party.color ? `#${party.color}` : DEFAULT_PARTY_COLOR;
        const previousColor = lighten(PREVIOUS_BAR_LIGHTEN_AMOUNT, color);

        if (percent >= MIN_PERCENT_THRESHOLD && party.abbreviation) {
            currentYearSonstigeVotes -= party.votes;
            partyDataMap.set(party.abbreviation, {
                abbreviation: party.abbreviation,
                color: color,
                previousColor: previousColor,
                currentPercent: percent,
                previousPercent: null,
            });
        }
    });

    if (previousYear) {
        previousYearVotesData.forEach(party => {
            const percent = previousYearTotalValidVotes > 0 ? (party.votes / previousYearTotalValidVotes) * 100 : 0;

            if (percent >= MIN_PERCENT_THRESHOLD && party.abbreviation) {
                previousYearSonstigeVotes -= party.votes;

                if (partyDataMap.has(party.abbreviation)) {
                    const existing = partyDataMap.get(party.abbreviation)!;
                    existing.previousPercent = percent;
                } else {
                    const color = party.color ? `#${party.color}` : DEFAULT_PARTY_COLOR;
                    const previousColor = lighten(PREVIOUS_BAR_LIGHTEN_AMOUNT, color);
                    partyDataMap.set(party.abbreviation, {
                        abbreviation: party.abbreviation,
                        color: color,
                        previousColor: previousColor,
                        currentPercent: null,
                        previousPercent: percent,
                    });
                }
            }
        });
    }

    const currentSonstigePercent = currentYearTotalValidVotes > 0 ? (currentYearSonstigeVotes / currentYearTotalValidVotes) * 100 : 0;
    const previousSonstigePercent = previousYearTotalValidVotes > 0 ? (previousYearSonstigeVotes / previousYearTotalValidVotes) * 100 : 0;

    if (currentSonstigePercent > 0 || (previousYear && previousSonstigePercent > 0)) {
        partyDataMap.set("Sonstige", {
            abbreviation: "Sonstige",
            color: SONSTIGE_COLOR,
            previousColor: lighten(PREVIOUS_BAR_LIGHTEN_AMOUNT, SONSTIGE_COLOR),
            currentPercent: currentSonstigePercent > 0.05 ? currentSonstigePercent : null,
            previousPercent: (previousYear && previousSonstigePercent > 0.05) ? previousSonstigePercent : null,
        });
    }

    const barChartData = Array.from(partyDataMap.values()).sort((a, b) => {
        const percentA = a.currentPercent ?? -1;
        const percentB = b.currentPercent ?? -1;
        return percentB - percentA;
    });


    const currentSeatsRaw = await getSeatAndCoalitionDataForYear(currentYear); //TODO put all await calls in a single promise resolver
    const previousSeatsRaw = previousYear ? await getSeatAndCoalitionDataForYear(previousYear) : [] as RawSeatInfo[];

    let totalCurrentSeats = 0;
    let totalPreviousSeats = 0;
    const previousSeatsMap = new Map(previousSeatsRaw.map(p => [p.abbreviation, p.seats]));

    const processedSeatData: ProcessedSeatInfo[] = currentSeatsRaw.map(party => {
        totalCurrentSeats += party.seats;
        const prevSeats = previousSeatsMap.get(party.abbreviation);
        let change: number | null = null;

        if (prevSeats !== undefined) {
            totalPreviousSeats += prevSeats;
            change = party.seats - prevSeats;
        } else if (previousYear !== null) {
            change = party.seats;
        }

        return {
            abbreviation: party.abbreviation,
            color: party.color || DEFAULT_SEAT_COLOR,
            seats: party.seats,
            change: change,
        };
    });
    const totalCurrentSeatsForSeating = currentSeatsRaw.reduce((sum, p) => sum + p.seats, 0);
    let totalPreviousSeatsForSeating = 0;
    currentSeatsRaw.forEach(party => {
        totalPreviousSeatsForSeating += previousSeatsMap.get(party.abbreviation) || 0;
    });
    const totalSeatChange = previousYear !== null ? totalCurrentSeatsForSeating - totalPreviousSeatsForSeating : null;

    return (
        <div className="container mx-auto p-4 space-y-10">
            <h1 className="text-3xl font-bold text-center">
                Bundestagswahl {currentYear} - Ergebnisse
            </h1>

            {/* Seating Chart */}
            {processedSeatData.length > 0 ? (
                <BundestagSeatingChart
                    seatData={processedSeatData}
                    totalSeats={totalCurrentSeats}
                    totalChange={totalSeatChange}
                    currentYear={currentYear}
                    previousYear={previousYear}
                />
            ) : (
                <div className="text-center text-gray-500 py-10">Keine Sitzverteilungsdaten für {currentYear} verfügbar.</div>
            )}

            {/* Coalitions */}
            <CoalitionVisualizations
                parties={currentSeatsRaw}
                currentYear={currentYear}
            />

            {/* Bar Chart */}
            <div className="max-w-4xl mx-auto">
                <ElectionPrimaryVotesChart
                    chartData={barChartData}
                    currentYear={currentYear}
                    previousYear={previousYear}
                />
            </div>
        </div>
    );
}

export default ElectionPage;