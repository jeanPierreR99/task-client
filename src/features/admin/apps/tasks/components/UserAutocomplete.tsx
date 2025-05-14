import { useEffect, useState } from "react"
import { Input } from "../../../../../shared/components/ui/input"
import { API } from "../../../../../shared/js/api"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { useParams } from "react-router-dom"

type UserType = {
    id: string
    name: string
}

type Props = {
    field: {
        value: string
        onChange: (value: string) => void
        onBlur?: () => void
        name?: string
        ref?: React.Ref<any>
    }
    onSelect?: (user: UserType) => void
    setUserId: (id: string) => void
}

export const UserAutoComplete = ({ field, onSelect, setUserId }: Props) => {
    const [search, setSearch] = useState(field.value || "")
    const [suggestions, setSuggestions] = useState<UserType[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const { projectId } = useStoreLogin();
    const { id } = useParams<{ id: string }>();
    
    const projectIdParam = id ? id : projectId;

    useEffect(() => {
        if (!search || search.length < 3) return setSuggestions([])

        const delay = setTimeout(async () => {
            try {
                const response = await API.getUserSugestion(search, projectIdParam)
                if (response?.success && response.data) {
                    setSuggestions(response.data)
                }
            } catch (error) {
                console.error("Error al buscar usuarios:", error)
            }
        }, 500)

        return () => clearTimeout(delay)
    }, [search])

    const handleSelect = (user: UserType) => {
        field.onChange(user.name)
        setSearch(user.name)
        setUserId(user.id)
        setShowSuggestions(false)
        onSelect?.(user)
    }

    return (
        <div className="relative">
            <Input
                {...field}
                value={search}
                placeholder="Nombre del responsable"
                autoComplete="off"
                onChange={(e) => {
                    field.onChange(e.target.value)
                    setSearch(e.target.value)
                    setShowSuggestions(true)
                    setUserId("")
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
                            {user.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
