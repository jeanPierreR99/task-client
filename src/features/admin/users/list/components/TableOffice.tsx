import { useEffect, useState } from "react";
import { API } from "../../../../../shared/js/api";
import { Loader2, Search } from "lucide-react";
import { AlertMessage } from "../../../../../components/AlertMessage";

type Office = {
    name: string;
    siglas: string;
};

export default function TableOffice() {
    const [office, setOffice] = useState<Office[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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
    };

    const filteredOffices = office.filter(offi =>
        offi.name.toLowerCase().includes(searchQuery)
    );

    if (loading) {
        return <Loader2 className="animate-spin text-xl text-blue-500 mx-auto" />;
    }

    if (error) {
        return <AlertMessage message={`Ocurrió un error al cargar los roles: ${error.message}`} ></ AlertMessage >;
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
                    {filteredOffices.map((offi: Office, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50 transition-all">
                            <td className="px-6 py-4 text-sm text-gray-700 text-center font-bold">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offi.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{offi.siglas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
