"use client";
import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell
} from 'recharts';

const formatNumberDE = (value) => {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
};

const RenderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
    const formattedValue = formatNumberDE(value);
    const yPos = y - 4;
    if (!value || value < 0.5) {
        return null;
    }
    return (
        <text x={x + width / 2} y={yPos} fill="#333" textAnchor="middle" dominantBaseline="bottom" fontSize={12}>
            {formattedValue}
        </text>
    );
};

const DEFAULT_PARTY_COLOR = '#8884d8';

const ElectionPrimaryVotesChart = ({ chartData, currentYear, previousYear }) => {
    if (!chartData || chartData.length === 0) {
        return <div className="text-center p-4">Keine Daten verfügbar.</div>;
    }

    const maxPercent = Math.max(...chartData.map(d => Math.max(d.currentPercent || 0, d.previousPercent || 0)));
    const yAxisMax = Math.ceil(maxPercent / 5) * 5;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const currentPayload = payload.find(p => p.name === `Bundestagswahl ${currentYear}`);
            const previousPayload = payload.find(p => p.name === `Bundestagswahl ${previousYear}`);

            return (
                <div className="bg-white p-3 shadow-md border border-gray-200 rounded text-sm">
                    <p className="font-bold mb-1">{label}</p>
                    {}
                    {currentPayload && currentPayload.value && (
                        <p style={{ color: '#33333' }}>
                            {`${currentYear}: ${formatNumberDE(currentPayload.value)}%`}
                        </p>
                    )}
                    {previousPayload && previousPayload.value && (
                        <p style={{ color: '#80828a' }}>
                            {`${previousYear}: ${formatNumberDE(previousPayload.value)}%`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <div className="flex justify-center items-center space-x-4 mt-4 text-sm">
                {
                    payload.map((entry, index) => {
                        const color = entry.payload.fill;
                        let text = '';
                        // Match based on the 'name' prop given to the <Bar> component
                        if (entry.value === `Bundestagswahl ${currentYear}`) text = `Bundestagswahl ${currentYear}`;
                        if (entry.value === `Bundestagswahl ${previousYear}`) text = `Bundestagswahl ${previousYear}`;

                        return text ? (
                            <div key={`item-${index}`} className="flex items-center">
                                <span className="w-3 h-3 mr-2" style={{ backgroundColor: color }}></span>
                                <span>{text}</span>
                            </div>
                        ) : null;
                    })
                }
            </div>
        );
    }


    return (
        <div className="bg-white p-4 md:p-6 rounded shadow-lg w-full">
            <h2 className="text-xl font-bold mb-1">Erststimmen</h2>
            <p className="text-sm text-gray-600 mb-4">Bundestagswahl {currentYear}</p>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 0, left: -20, bottom: 5 }}
                    barGap={-15} // Control overlap
                    barCategoryGap="25%" // Gap between parties
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="abbreviation" tickLine={false} axisLine={true} dy={10} />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        domain={[0, yAxisMax]}
                        tickCount={yAxisMax/5 + 1}
                        tickFormatter={(tick) => `${tick}`}
                        label={{ value: '', position: 'insideTopLeft', dx: 10, dy: -15, fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.3)' }}/>
                    <Legend content={renderLegend} verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }}/>

                    {previousYear && (
                        <Bar
                            dataKey="previousPercent"
                            name={`Bundestagswahl ${previousYear}`}
                            fill="#ccc"
                            // fillOpacity={0.75}
                        >
                            {
                                chartData.map((entry, index) => (
                                    <Cell key={`cell-prev-${index}`} fill={entry.previousColor || '#cccccc'} />
                                    // <Cell key={`cell-prev-${index}`} fill={entry.previousColor || '#cccccc'} fillOpacity={0.75}/>
                                ))
                            }
                        </Bar>
                    )}

                    <Bar
                        dataKey="currentPercent"
                        name={`Bundestagswahl ${currentYear}`}
                        fill="#8884d8"
                    >
                        {
                            chartData.map((entry, index) => (
                                <Cell key={`cell-curr-${index}`} fill={entry.color || DEFAULT_PARTY_COLOR}/>
                            ))
                        }
                        <LabelList dataKey="currentPercent" content={<RenderCustomizedLabel />} />
                    </Bar>

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ElectionPrimaryVotesChart;