import { useEffect, useState } from "react"
import { API } from "../../../../../shared/js/api"
import { Textarea } from "../../../../../shared/components/ui/textarea"

type OfficeType = {
    id: string
    name: string
    siglas: string
}

type Props = {
    field: {
        value: string
        onChange: (value: string) => void
        onBlur?: () => void
        name?: string
        ref?: React.Ref<any>
    }
    onSelect?: (office: OfficeType) => void
    setOfficeId: (id: string) => void
}

export const OfficeAutoComplete = ({ field, onSelect, setOfficeId }: Props) => {
    const [search, setSearch] = useState(field.value || "")
    const [suggestions, setSuggestions] = useState<OfficeType[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    useEffect(() => {
        if (!search || search.length < 2) return setSuggestions([])

        const delay = setTimeout(async () => {
            try {
                const response = await API.getOffices(search)
                if (response?.success && response.data) {
                    setSuggestions(response.data)
                }
            } catch (error) {
                console.error("Error al buscar oficinas:", error)
            }
        }, 500)

        return () => clearTimeout(delay)
    }, [search])

    const handleSelect = (office: OfficeType) => {
        field.onChange(office.name)
        setSearch(`(${office.siglas}) ${office.name}`)
        setOfficeId(office.id)
        setShowSuggestions(false)
        onSelect?.(office)
    }

    return (
        <div className="relative">
            <Textarea
                // rows={2}
                {...field}
                value={search}
                placeholder="Nombre de la oficina"
                autoComplete="off"
                onChange={(e) => {
                    field.onChange(e.target.value)
                    setSearch(e.target.value)
                    setShowSuggestions(true)
                    setOfficeId("")
                }}
                onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto">
                    {suggestions.map((user) => (
                        <div
                            key={user.id}
                            onMouseDown={() => handleSelect(user)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                            ({user.siglas}) {user.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
