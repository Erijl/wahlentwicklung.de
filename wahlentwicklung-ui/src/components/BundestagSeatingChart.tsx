"use client";
import React, { useMemo, useState } from 'react';

const polarToCartesian = (centerX, centerY, radius, angleInRadians) => ({
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
});
const formatChange = (change) => {
    if (change === null || change === undefined) return '';
    if (change > 0) return `+${change}`;
    if (change === 0) return `±0`;
    return `${change}`;
};


interface SeatInfo {
    abbreviation: string;
    color: string;
    seats: number;
    change: number | null;
}
interface BundestagSeatingChartProps {
    seatData: SeatInfo[];
    totalSeats: number;
    totalChange: number | null;
    currentYear: number;
    previousYear: number | null;
}

const BundestagSeatingChart = ({
                                   seatData,
                                   totalSeats,
                                   totalChange,
                                   currentYear,
                                   previousYear,
                               }: BundestagSeatingChartProps) => {

    const [hoveredParty, setHoveredParty] = useState<string | null>(null);

    const svgWidth = 600;
    const svgHeight = 350;
    const centerX = svgWidth / 2;
    const centerY = svgHeight * 0.8;
    const dotRadius = totalSeats*(0.0079 - (totalSeats/100-5) * 0.001);
    const seatPadding = dotRadius * 0.6;
    const rowPadding = dotRadius * 1.0;
    const outerRadius = svgWidth * 0.45;
    const innerRadius = outerRadius * 0.4;
    const baseStartAngle = Math.PI; // 180 degrees
    const baseEndAngle = 2 * Math.PI;
    const totalAngleRange = baseEndAngle - baseStartAngle;

    const { dots, orderedSeatData, seatCountMap } = useMemo(() => {
        if (!seatData || seatData.length === 0 || totalSeats === 0) {
            return { dots: [], orderedSeatData: [], seatCountMap: new Map() };
        }

        const sortedData = [...seatData];

        const countMap = new Map(sortedData.map(p => [p.abbreviation, p.seats]));

        const partyAngularData: (SeatInfo & { startAngle: number; endAngle: number })[] = [];
        let currentAngle = baseStartAngle;

        sortedData.forEach((party) => {
            const partyAngleWidth = (party.seats / totalSeats) * totalAngleRange;
            const startAngle = currentAngle;
            const endAngle = currentAngle + partyAngleWidth;

            partyAngularData.push({ ...party, startAngle, endAngle });
            currentAngle = endAngle;
        });

        const finalOrderedSeatData = [...partyAngularData];

        const calculatedDots: { cx: number; cy: number; fill: string; party: string }[] = [];
        const seatsPlacedPerParty: { [key: string]: number } = {};
        seatData.forEach(p => { seatsPlacedPerParty[p.abbreviation] = 0; });
        let totalDotsPlaced = 0;
        const numRows = Math.floor((outerRadius - innerRadius - dotRadius * 2) / (dotRadius * 2 + rowPadding)) + 1;

        for (let i = 0; i < numRows; i++) {
            const rowRadius = innerRadius + dotRadius + i * (dotRadius * 2 + rowPadding);
            const circumference = Math.PI * rowRadius;
            const maxDotsInRow = Math.floor(circumference / (dotRadius * 2 + seatPadding));
            const angleStep = maxDotsInRow > 1 ? totalAngleRange / (maxDotsInRow - 1) : 0;
            const missingDots = totalSeats - totalDotsPlaced;

            if (missingDots < 20) break;

            for (let j = 0; j < maxDotsInRow; j++) {
                if (totalDotsPlaced >= totalSeats) break;
                const angle = baseStartAngle + j * angleStep;
                const epsilon = 0.00001;
                const clampedAngle = Math.max(baseStartAngle + epsilon, Math.min(baseEndAngle - epsilon, angle));

                let assignedParty: (SeatInfo & { startAngle: number; endAngle: number }) | null = null;
                for (const party of partyAngularData) {
                    if (clampedAngle >= party.startAngle && clampedAngle < party.endAngle) {
                        assignedParty = party;
                        break;
                    }
                }

                if (assignedParty && seatsPlacedPerParty[assignedParty.abbreviation] < assignedParty.seats) {
                    const pos = polarToCartesian(centerX, centerY, rowRadius, angle);
                    calculatedDots.push({
                        cx: pos.x,
                        cy: pos.y,
                        fill: `#${assignedParty.color || 'CCCCCC'}`,
                        party: assignedParty.abbreviation,
                    });
                    seatsPlacedPerParty[assignedParty.abbreviation]++;
                    totalDotsPlaced++;
                }
            }
            if (totalDotsPlaced >= totalSeats) break;
        }

        if (totalDotsPlaced < totalSeats) {
            console.warn(`Could only place ${totalDotsPlaced} out of ${totalSeats} seats. Adjust parameters.`);
        }

        return { dots: calculatedDots, orderedSeatData: finalOrderedSeatData, seatCountMap: countMap };

    }, [seatData, totalSeats, innerRadius, outerRadius, dotRadius, rowPadding, seatPadding]);

    return (
        <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full max-w-2xl mx-auto text-center">
            {/* --- Title --- */}
            <h2 className="text-xl font-bold mb-1">Sitzverteilung im Bundestag</h2>
            <p className="text-sm text-gray-600 mb-4">
                Bundestagswahl {currentYear}
            </p>

            {/* --- SVG Chart --- */}
            <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-auto"
                onMouseLeave={() => setHoveredParty(null)}
            >
                {/* Render Dots with Hover Effects and Tooltip */}
                {dots.map((dot, index) => {
                    const isHovered = hoveredParty === dot.party;
                    const isDimmed = hoveredParty !== null && !isHovered;
                    const partySeats = seatCountMap.get(dot.party) || 0;

                    return (
                        <circle
                            key={`dot-${index}`}
                            cx={dot.cx}
                            cy={dot.cy}
                            r={dotRadius}
                            fill={dot.fill}
                            // Apply styles based on hover state
                            className={`transition-opacity duration-150 ease-in-out ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                            style={{
                                transform: isHovered ? 'scale(1)' : 'scale(1)', //TODO looks horrible when >1 check if needed
                                transformOrigin: `${dot.cx}px ${dot.cy}px`,
                                transition: 'transform 150ms ease-in-out, opacity 150ms ease-in-out'
                            }}
                            onMouseEnter={() => setHoveredParty(dot.party)}
                        >
                            {/* Simple Tooltip TODO fix */}
                            <title>{`${dot.party}: ${partySeats} Sitze`}</title>
                        </circle>
                    );
                })}

                {/* Central Text */}
                <text /* ... Total Seats ... */
                    x={centerX} y={centerY - 10} textAnchor="middle" dominantBaseline="middle"
                    className="text-2xl font-bold fill-current text-gray-800">
                    {totalSeats}
                </text>
                <text /* ... Abgeordnete ... */
                    x={centerX} y={centerY + 15} textAnchor="middle" dominantBaseline="middle"
                    className="text-lg fill-current text-gray-600">
                    Abgeordnete
                </text>
                {totalChange !== null && (
                    <text /* ... Change vs Previous ... */
                        x={centerX} y={centerY + 40} textAnchor="middle" dominantBaseline="middle"
                        className={`text-sm font-semibold ${ totalChange > 0 ? 'text-green-600' : totalChange < 0 ? 'text-red-600' : 'text-gray-500' } fill-current`}>
                        {formatChange(totalChange)} {previousYear ? `vs. ${previousYear}`: ''}
                    </text>
                )}
            </svg>

            {/* --- Legend Table (Uses orderedSeatData, already left-to-right) --- */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm mx-auto max-w-lg">
                    <thead>
                    <tr className="border-b border-gray-300">
                        {orderedSeatData.map((party) => (
                            <th key={party.abbreviation} className="p-2 font-semibold" style={{ color: `#${party.color || 'CCCCCC'}` }}>
                                {party.abbreviation}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b border-gray-300">
                        {orderedSeatData.map((party) => (
                            <td key={party.abbreviation} className="p-2 font-bold text-gray-800">
                                {party.seats}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {orderedSeatData.map((party) => (
                            <td key={party.abbreviation} className={`p-2 ${ party.change === null ? 'text-gray-400' : party.change > 0 ? 'text-green-600' : party.change < 0 ? 'text-red-600' : 'text-gray-500' }`}>
                                {party.change !== null ? formatChange(party.change) : '-'}
                            </td>
                        ))}
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BundestagSeatingChart;