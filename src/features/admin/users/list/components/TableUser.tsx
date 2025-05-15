import { useState } from 'react';
import { Eye, Loader2, Search } from 'lucide-react';
import useApiFetch from '../../../../../hooks/useApiFetch';
import { API, API_PATH } from '../../../../../shared/js/api';
import { Button } from '../../../../../shared/components/ui/button';
import { AlertMessage } from '../../../../../components/AlertMessage';
import { NavLink } from 'react-router-dom';
import { TooltipWrapper } from '../../../../../components/TooltipWrapper';

type UserRole = {
    id: string;
    name: string;
};

type Project = {
    id: string;
    name: string;
    description: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    telephone: number;
    passwordHash: string;
    imageUrl: string;
    active: boolean;
    roleId: string;
    role: UserRole;
    projects: Project[];
};

export default function TableUser() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const { data, error, isLoading } = useApiFetch(['users'], () => API.getAllUsers());

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(1); // Reinicia la página al buscar
    };

    const filteredUsers = data?.data.filter((user: User) =>
        user.name.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery)
    );

    const totalUsers = filteredUsers?.length || 0;
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedUsers = filteredUsers?.slice(startIndex, startIndex + usersPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    if (isLoading) {
        return <Loader2 className="animate-spin text-xl text-blue-500 mx-auto" />;
    }

    if (error) {
        return <AlertMessage message={`Ocurrió un error al cargar los usuarios: ${error.message}`} />;
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

            <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th>#</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Foto</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Teléfono</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Email</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Proyecto</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Rol</th>
                        <th className="px-6 border-r py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600" />
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers?.map((user: User, index: number) => (
                        <tr key={user.id} className="border-t hover:bg-gray-50 transition-all">
                            <td className="px-6 py-4 text-sm text-gray-700 text-center font-bold">
                                {startIndex + index + 1}
                            </td>
                            <td className="px-6 py-4">
                                <img
                                    src={API_PATH + user.imageUrl}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.telephone}</td>
                            <td className="px-6 py-4 text-sm text-blue-500">{user.email}</td>
                            <td className="px-6 py-4 flex gap-2 text-sm flex-col items-center justify-center">{user.projects?.map((project) => <span className="bg-yellow-100 text-yellow-700 w-fit text-sm  px-3 rounded-full">
                                {project.name}
                            </span>) || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.role.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {user.active ? (
                                    <span className="bg-green-100 text-green-700 w-fit text-sm py-[3px] px-3 rounded-full">
                                        Activo
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 w-fit text-sm py-[3px] px-3 rounded-full">
                                        Baja
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <TooltipWrapper content="Inspeccionar">
                                    <NavLink to={`/users/view/${user.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye />
                                        </Button>
                                    </NavLink>
                                </TooltipWrapper>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={handlePrevPage}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={handleNextPage}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
