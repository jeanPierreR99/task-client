import { useEffect, useState } from "react";
import { API } from "../../../../../shared/js/api";
import { Loader2, Search } from "lucide-react";
import { AlertMessage } from "../../../../../components/AlertMessage";

type Office = {
    name: string;
    siglas: string;
};

const ITEMS_PER_PAGE = 10;

export default function TableOffice() {
    const [office, setOffice] = useState<Office[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await API.getOffices();
                setOffice(response.data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffices();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(1);
    };
    const filteredOffices = office.filter(offi =>
        offi.name.toLowerCase().includes(searchQuery) || offi.siglas.toLocaleLowerCase().includes(searchQuery)
    );

    const totalPages = Math.ceil(filteredOffices.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentOffices = filteredOffices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) {
        return <Loader2 className="animate-spin text-xl text-blue-500 mx-auto" />;
    }

    if (error) {
        return <AlertMessage message={`Ocurrió un error al cargar los roles: ${error.message}`} />;
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
                />
            </div>

            <table className="min-w-full bg-white rounded-md shadow-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th>#</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Siglas</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOffices.map((offi, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50 transition-all">
                            <td className="px-6 py-4 text-sm text-gray-700 text-center font-bold">
                                {startIndex + index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offi.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offi.siglas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4 text-sm">
                <span>
                    Página {currentPage} de {totalPages}
                </span>
                <div className="space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
