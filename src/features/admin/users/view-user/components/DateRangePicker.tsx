import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowUpDown, Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../shared/components/ui/popover"
import { Button } from "../../../../../shared/components/ui/button"
import { cn } from "../../../../../lib/utils"
import { Calendar } from "../../../../../shared/components/ui/calendar"
import { TooltipWrapper } from "../../../../../components/TooltipWrapper"

interface Props {
    date: DateRange | undefined
    setDate: (range: DateRange | undefined) => void
}

const today = new Date();


export function DateRangePicker({ date, setDate }: Props) {
    const from = date?.from ? format(date.from, "PPP", { locale: es }) : ""
    const to = date?.to ? format(date.to, "PPP", { locale: es }) : ""

    return (
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-fit justify-start text-left font-normal shadow-lg",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {from} - {to}
                                </>
                            ) : (
                                from
                            )
                        ) : (
                            <span>Seleccionar fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={es}
                    />
                </PopoverContent>
            </Popover>
            <TooltipWrapper content="Refrescar">
                <Button variant="outline" onClick={() => setDate({
                    from: today,
                    to: today
                })} className=" shadow-lg text-gray-500">
                    <ArrowUpDown />
                </Button>
            </TooltipWrapper>
        </div >
    )
}
