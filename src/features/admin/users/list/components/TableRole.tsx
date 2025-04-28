import { useEffect, useState } from "react";
import { API } from "../../../../../shared/js/api";
import { Loader2, Search } from "lucide-react";
import { AlertMessage } from "../../../../../components/AlertMessage";

type Role = {
    name: string;
    userCount: number;
};

export default function TableRole() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await API.getRole();
                setRoles(response.data);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery)
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
                    placeholder="Buscar por nombre de rol"
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
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRoles.map((role, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50 transition-all">
                            <td className="px-6 py-4 text-sm text-gray-700 text-center font-bold">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{role.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{role.userCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
