"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, } from "../../../../../shared/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../shared/components/ui/card"
import React from "react"
import { IdataComplete } from "./DashBoard"
import { Check, DownloadCloud } from "lucide-react"
import { TooltipWrapper } from "../../../../../components/TooltipWrapper"
import { API_BASE } from "../../../../../shared/js/api"

const chartConfig = {
    ticket: {
        label: "ticket",
        color: "orange",
    },
    task: {
        label: "tarea",
        color: "#5985ff",
    },
} satisfies ChartConfig

interface PropChart {
    data: IdataComplete
    dateRange: any,
    userId: string
}

const ChartTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const formattedDate = new Date(label).toLocaleDateString("es", {
        month: "short",
        day: "numeric",
    })

    return (
        <div className="bg-white p-2 rounded shadow text-sm min-w-[120px] flex flex-col gap-1">
            <p className="font-semibold">{formattedDate}</p>
            <p className="text-xs text-gray-500 flex gap-1 justify-between">📌 Tareas: <p className="font-black">{payload[0]?.payload?.task}</p></p>
            <p className="text-xs text-gray-500 flex gap-1 justify-between">🎫 Tickets:<p className="font-black"> {payload[0]?.payload?.ticket}</p></p>
        </div>
    )
}


const ChartBartGradient: React.FC<PropChart> = ({ data, dateRange, userId }) => {

    return (
        <Card className="border-none shadow-lg">
            <CardHeader>
                <CardTitle>Mostrando datos dentro del rango de fechas</CardTitle>
                <CardDescription className="flex justify-between">
                    Tareas y tickets completados y atendidos
                    <TooltipWrapper content="Descargar Reporte">
                        <a href={`${API_BASE}/report/user/${userId}?start=${dateRange?.from ? dateRange.from.toISOString() : ''}&end=${dateRange?.to ? dateRange.to.toISOString() : ''}`}><DownloadCloud /></a>
                    </TooltipWrapper>
                </CardDescription>
            </CardHeader>
            <CardContent >
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data.chart}
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
                            interval={4}
                            tickFormatter={(value) => new Date(value).toLocaleDateString("es", {
                                month: "short",
                                day: "numeric",
                            })}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-ticket)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-ticket)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-task)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-task)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="task"
                            type="linear"
                            fill="url(#fillMobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-task)"
                            stackId="a"
                        />
                        <Area
                            dataKey="ticket"
                            type="linear"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-ticket)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />

                    </AreaChart>
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

export default ChartBartGradient;