"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../shared/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../../../../../shared/components/ui/chart"

const chartConfig = {
    task: {
        label: "tarea",
        color: "hsl(var(--chart-1))",
    },
    ticket: {
        label: "tickets",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface Idata {
    date: string;
    task: number;
    ticket: number
}

interface PropChart {
    data: Idata[] | []
}
const ChartBarPending: React.FC<PropChart> = ({ data }) => {
    return (
        <Card className="shadow-lg border-none">
            <CardHeader>
                <CardTitle>Tareas y tickets</CardTitle>
                <CardDescription>Pendientes de esta semana</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("es", {
                                    weekday: "long",
                                })
                            }}
                        />
                        <YAxis axisLine={false}></YAxis>
                        <Bar
                            dataKey="task"
                            stackId="a"
                            fill="#f5d37d"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="ticket"
                            stackId="a"
                            fill="#5985ff"
                            radius={[4, 4, 0, 0]}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                            cursor={false}
                            defaultIndex={1}
                        />
                        <ChartLegend content={<ChartLegendContent />} />

                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
export default ChartBarPending;