"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../shared/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../../../../../shared/components/ui/chart"
import { Check } from "lucide-react"
import { IdataComplete } from "./DashBoard"

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

interface PropChart {
    data: IdataComplete
}
const ChartBarComplete: React.FC<PropChart> = ({ data }) => {
    return (
        <Card className="shadow-lg border-none">
            <CardHeader>
                <CardTitle>Tareas y tickets</CardTitle>
                <CardDescription>completadas de esta semana</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data.chart}>
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

            {data.data.length > 0 &&
                <CardFooter className="flex-col items-start md:items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <CardTitle>Lista de tareas</CardTitle>
                            <div className="mt-2">
                                {data.data
                                    .filter((item) => item.ticket === false)
                                    .map((item, index) =>
                                        <li key={index} className="flex gap-2 text-sm text-gray-500">
                                            <Check size={15}></Check>
                                            <p>{item.name}</p>
                                            <p className="font-bold">({new Date(item.dateCulmined).toLocaleDateString("es", {
                                                month: "short",
                                                day: "numeric",
                                            })})
                                            </p>
                                        </li>
                                    )}
                            </div>
                        </div>
                        <div>
                            <CardTitle>Lista de tickets</CardTitle>
                            <div className="mt-2">
                                {data.data
                                    .filter((item) => item.ticket === true)
                                    .map((item, index) =>
                                        <li key={index} className="flex gap-2 text-sm text-gray-500">
                                            <Check size={15}></Check>
                                            <p>{item.name}</p>
                                            <p className="font-bold">({new Date(item.dateCulmined).toLocaleDateString("es", {
                                                month: "short",
                                                day: "numeric",
                                            })})
                                            </p>
                                        </li>
                                    )}
                            </div>
                        </div>
                    </div>
                </CardFooter>
            }
        </Card>
    )
}

export default ChartBarComplete;