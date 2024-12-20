"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  { date: "Sozialdemokratische Partei Deutschlands", desktop: 11955434, mobile: 150 },
  { date: "Christlich Demokratische Union Deutschlands", desktop: 8775471, mobile: 180 },
  { date: "BÜNDNIS 90/DIE GRÜNEN", desktop: 6852206, mobile: 120 },
  { date: "Freie Demokratische Partei", desktop: 5319952, mobile: 260 },
  { date: "Alternative für Deutschland", desktop: 4803902, mobile: 290 },
  { date: "Christlich-Soziale Union in Bayern e.V.", desktop: 2402827, mobile: 340 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Wähler*innen",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function Component() {
  const [activeChart, setActiveChart] =
      React.useState<keyof typeof chartConfig>("desktop")

  const total = React.useMemo(
      () => ({
        desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
        mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      }),
      []
  )

  return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Bar Chart - Interactive</CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
          <div className="flex">
            {["desktop"].map((key) => {
              const chart = key as keyof typeof chartConfig
              return (
                  <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                      onClick={() => setActiveChart(chart)}
                  >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
                  </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
            <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    return value;
                  }}
              />
              <ChartTooltip
                  content={
                    <ChartTooltipContent
                        className="w-[150px]"
                        nameKey="views"
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }}
                    />
                  }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}
