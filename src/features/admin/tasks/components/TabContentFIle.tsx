import { useState, useEffect } from "react"
import { FileText, CalendarDays, Download, Search } from "lucide-react"
import { format } from "date-fns"
import { Button } from "../../../../shared/components/ui/button"
import useStoreFile from "../store/useStoreFile"
import { API_PATH } from "../../../../shared/js/api"

const TabContentFile = () => {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 30

    const { files } = useStoreFile()



    const filteredFiles = files.filter(
        (file) => file.name?.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filteredFiles.length / itemsPerPage)
    const paginatedFiles = filteredFiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    return (
        <div className="py-2 space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar archivo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedFiles.map((file: any) => (
                    <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 rounded-md border bg-gray-50 hover:shadow transition-shadow"
                    >
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                            <FileText size={28} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-gray-800 font-medium break-words text-sm">{file.name}</p>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <CalendarDays size={14} />
                                {format(new Date(file.uploaded_in), "dd MMM yyyy, HH:mm")}
                            </div>
                        </div>
                        <a href={API_PATH + file.url} target="__blank" className="p-1 rounded hover:bg-gray-200">
                            <Download size={20} className="text-gray-500" />
                        </a>
                    </div>
                ))}
            </div>

            {filteredFiles.length > itemsPerPage && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>

                    <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    )
}

export default TabContentFile
