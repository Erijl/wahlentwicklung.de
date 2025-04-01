"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    {name: "SPD", totalSecondaryVotes: 11955434, percentage: 0.2574270720291405, fill: '#E3000F'},
    {name: "CDU", totalSecondaryVotes: 8775471, percentage: 0.1889553992942986, fill: '#151518'},
    {name: "Grüne", totalSecondaryVotes: 6852206, percentage: 0.14754322825256772, fill: '#46962B'},
    {name: "FDP", totalSecondaryVotes: 5319952, percentage: 0.11455039329359103, fill: '#FFFF00'},
    {name: "AfD", totalSecondaryVotes: 4803902, percentage: 0.10343868956785109, fill: '#009EE0'},
    {name: "CSU", totalSecondaryVotes: 2402827, percentage: 0.05173820701135263, fill: '#151518'},
    {name: "Übrige", totalSecondaryVotes: 6332231, percentage: 0.13634701055119844, fill: '#C0C0C0'},
]

const chartConfig = {

} satisfies ChartConfig

export default function Component() {

    chartData.forEach(x => x.percentage = Number((x.percentage * 10).toFixed(3)) );

    return (
        <Card>Main Page
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Wahlergebnis Zweitstimmen</CardTitle>
                    <CardDescription>
                        Showing total secondary votes for each party
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer className="aspect-auto h-[250px] w-full" config={chartConfig}>
                    <BarChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                        />
                        <YAxis />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="percentage"
                                    labelFormatter={(value) => {
                                        return value
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="percentage" fill="#8884d8" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}