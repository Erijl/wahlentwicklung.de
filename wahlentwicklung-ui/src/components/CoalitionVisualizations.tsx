"use client";
import React from 'react';

function generateCombinations(parties, k) {
    const combinations = [];
    const n = parties.length;
    if (k <= 0 || k > n) {
        return combinations;
    }

    const indices = Array(k).fill(0).map((_, i) => i);

    while (indices[0] <= n - k) {
        combinations.push(indices.map(i => parties[i]));

        let i = k - 1;
        while (i >= 0 && indices[i] === i + n - k) {
            i--;
        }

        if (i < 0) {
            break;
        }

        indices[i]++;
        for (let j = i + 1; j < k; j++) {
            indices[j] = indices[j - 1] + 1;
        }
    }
    return combinations;
}


interface PartyData {
    abbreviation: string;
    color: string;
    seats: number;
    inCoalition: boolean;
}

interface CoalitionBarProps {
    parties: PartyData[];
    totalSeats: number;
    majorityThreshold: number;
}

interface PossibleCoalition {
    parties: PartyData[];
    combinedSeats: number;
    name: string;
}

interface PossibleCoalitionsListProps {
    parties: PartyData[];
    totalSeats: number;
    majorityThreshold: number;
}

const GoverningCoalitionBar = ({ parties, totalSeats, majorityThreshold }: CoalitionBarProps) => {
    if (!parties || parties.length === 0 || totalSeats === 0) return null;

    const coalitionParties = parties.filter(p => p.inCoalition).sort((a, b) => b.seats - a.seats);
    const oppositionParties = parties.filter(p => !p.inCoalition).sort((a, b) => b.seats - a.seats);

    const sortedParties = [...coalitionParties, ...oppositionParties];

    const majorityPercent = (majorityThreshold / totalSeats) * 100;

    return (
        <div className="mb-2">
            <div className="relative w-full h-5 bg-gray-200 rounded overflow-hidden flex">
                {sortedParties.map(party => {
                    const widthPercent = (party.seats / totalSeats) * 100;
                    return (
                        <div
                            key={party.abbreviation}
                            className={`h-full ${party.inCoalition ? 'opacity-100' : 'opacity-40'}`}
                            style={{
                                width: `${widthPercent}%`,
                                backgroundColor: `#${party.color}`,
                            }}
                            title={`${party.abbreviation}: ${party.seats} Sitze (${(widthPercent).toFixed(1)}%)`}
                        />
                    );
                })}
                {/* Majority Marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white"
                    style={{ left: `${majorityPercent}%` }}
                    title={`Mehrheit: ${majorityThreshold} Sitze`}
                />
                <div // Notch effect
                    className="absolute -bottom-1 w-1 h-1 bg-white transform rotate-45"
                    style={{ left: `calc(${majorityPercent}% - 0.125rem)` }}
                />
            </div>
        </div>
    );
};

const PossibleCoalitionsList = ({ parties, totalSeats, majorityThreshold }: PossibleCoalitionsListProps) => {
    if (!parties || parties.length === 0 || totalSeats === 0) return null;

    let possibleCoalitions: PossibleCoalition[] = [];
    for (let k = 2; k <= 4; k++) {
        const combinations = generateCombinations(parties, k);
        combinations.forEach(combo => {
            if (combo.find(p => p.abbreviation == "AfD") != null) return;
            console.log(combinations)

            const combinedSeats = combo.reduce((sum, p) => sum + p.seats, 0);
            if (combinedSeats >= majorityThreshold) {
                combo.sort((a, b) => b.seats - a.seats);
                const name = combo.map(p => p.abbreviation).join('+');
                possibleCoalitions.push({ parties: combo, combinedSeats, name });
            }
        });
    }

    const uniqueCoalitions = Array.from(new Map(possibleCoalitions.map(c => [c.name, c])).values());


    uniqueCoalitions.sort((a, b) => b.combinedSeats - a.combinedSeats);

    const majorityPercent = (majorityThreshold / totalSeats) * 100;

    return (
        <div className="mt-4 space-y-3">
            {uniqueCoalitions.map((coalition) => {
                const combinedSeatsPercent = (coalition.combinedSeats / totalSeats) * 100;
                const hasMajority = coalition.combinedSeats >= majorityThreshold;

                return (
                    <div key={coalition.name} className="grid grid-cols-[auto,1fr,auto] gap-x-3 items-center text-sm">
                        {/* Icon and Name */}
                        <div className="flex items-center space-x-1.5 whitespace-nowrap">
                            {hasMajority ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className="font-medium text-gray-800">{coalition.name}</span>
                        </div>

                        {/* Mini Bar */}
                        <div className="relative w-full h-3.5 bg-gray-200 rounded overflow-hidden flex">
                            {coalition.parties.map(party => {
                                const widthPercent = (party.seats / totalSeats) * 100;
                                return (
                                    <div
                                        key={party.abbreviation}
                                        className="h-full"
                                        style={{
                                            width: `${widthPercent}%`,
                                            backgroundColor: `#${party.color}`,
                                        }}
                                        title={`${party.abbreviation}: ${party.seats}`}
                                    />
                                );
                            })}

                            {/* Majority Marker */}
                            <div
                                className="absolute top-0 bottom-0 w-px bg-gray-700"
                                style={{ left: `${majorityPercent}%` }}
                            />
                        </div>

                        {/* Seat Count */}
                        <div className="font-semibold text-gray-900 text-right w-10">
                            {coalition.combinedSeats}
                        </div>
                    </div>
                );
            })}
            {uniqueCoalitions.length === 0 && (
                <p className="text-sm text-gray-500 text-center col-span-3">Keine möglichen Koalitionen mit Mehrheit gefunden (bei 2-4 Parteien).</p>
            )}
        </div>
    );
};


interface CoalitionVisualizationsProps {
    parties: PartyData[];
    currentYear: number;
}

const CoalitionVisualizations = ({ parties, currentYear }: CoalitionVisualizationsProps) => {
    if (!parties || parties.length === 0) {
        return <div className="text-center text-gray-500 py-4">Koalitionsdaten nicht verfügbar.</div>;
    }

    const totalSeats = parties.reduce((sum, p) => sum + p.seats, 0);
    const majorityThreshold = Math.floor(totalSeats / 2) + 1;

    const hasGoverningCoalition = parties.some(p => p.inCoalition);

    return (
        <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
                {hasGoverningCoalition ? "Gebildete Regierungskoalition" : "Sitzverteilung"}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Mehrheit ab {majorityThreshold} Sitzen von insgesamt {totalSeats}
            </p>

            {/* Governing Coalition Bar */}
            <GoverningCoalitionBar
                parties={parties}
                totalSeats={totalSeats}
                majorityThreshold={majorityThreshold}
            />

            <hr className="my-6 border-gray-300" />

            {/* Possible Coalitions Section */}
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Mögliche Koalitionen</h3>
            <PossibleCoalitionsList
                parties={parties}
                totalSeats={totalSeats}
                majorityThreshold={majorityThreshold}
            />
        </div>
    );
};

export default CoalitionVisualizations;