import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../shared/components/ui/popover"
import { Button } from "../../../../../shared/components/ui/button"
import { Command, CommandGroup, CommandItem } from "../../../../../shared/components/ui/command"
import { cn } from "../../../../../lib/utils"

interface Option {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Selecciona opciones...",
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const selectedLabels = options
        .filter((opt) => selected.includes(opt.value))
        .map((opt) => opt.label)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {selectedLabels.length > 0
                        ? selectedLabels.join(", ")
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={() => toggleOption(option.value)}
                            >
                                <div
                                    className={cn(
                                        "mr-2 flex h-4 w-4 items-center overflow-hidden justify-center border border-primary",
                                        selected.includes(option.value) ? "bg-green-500 border-none" : "opacity-50"
                                    )}
                                >
                                    {selected.includes(option.value) && (
                                        <Check className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
