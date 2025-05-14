import { useEffect, useState } from 'react';
import { API, API_PATH } from '../../../../shared/js/api';
import { Task } from '../tasks/store/useStoreTask';
import useApiFetch from '../../../../hooks/useApiFetch';
import { AlertMessage } from '../../../../components/AlertMessage';
import DialogTasks from '../tasks/components/DialogTask';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../../../shared/components/ui/card';
import { Badge } from '../../../../shared/components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { Button } from '../../../../shared/components/ui/button';
import { Search, Loader2, User, UserCheck2, Info, ClipboardList, CalendarClock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { io } from 'socket.io-client';
import { format, parseISO } from 'date-fns';
import useStoreLogin from '../../../../shared/state/useStoreLogin';

const TaskMe = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const { id, projectId } = useStoreLogin();
    const {
        data,
        error,
        isLoading,
    } = useApiFetch(["all_tasks"], () => API.getTaskUser(id, projectId));

    const filteredTasks = tasks.filter((task: Task) => {
        const nameMatch = task.name?.toLowerCase().includes(search.toLowerCase());
        const responsibleMatch = task.responsible?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
        const createdByMatch = task.created_by?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;

        const statusMatch =
            statusFilter === 'all' ||
            (statusFilter === 'completado' && task.status === 'completado') ||
            (statusFilter === 'pendiente' && task.status !== 'completado');

        return (nameMatch || responsibleMatch || createdByMatch) && statusMatch;
    });

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpen = (task: Task) => {
        setSelectedTask(task);
        setOpen(true);
    };

    useEffect(() => {
        if (data?.data && Array.isArray(data.data)) {
            setTasks(data.data);
        }
    }, [data]);

    useEffect(() => {
        const socket = io(API_PATH);

        socket.on('updateTaskTicket', (eventData) => {
            const updated: Task = eventData.data;

            setTasks((prev) => {
                if (updated.responsible !== null) {
                    return prev.filter((task) => task.id !== updated.id);
                }

                const existingIndex = prev.findIndex((task) => task.id === updated.id);
                if (existingIndex !== -1) {
                    const copy = [...prev];
                    copy[existingIndex] = updated;
                    return copy;
                }

                return [updated, ...prev];
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const getStatusBadge = (status: string) => {
        return status === 'completado'
            ? <Badge className="bg-green-100 text-green-700">Completado</Badge>
            : <Badge className="bg-yellow-100 text-yellow-700 capitalize">{status}</Badge>;
    };

    return (
        <div>
            <span className="text-sm text-gray-400">Mis Tareas</span>
            <br /><br />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="relative w-sm">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar por nombre, creador o responsable"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10 pr-4"
                    />
                </div>

                <Select onValueChange={(val) => {
                    setStatusFilter(val);
                    setCurrentPage(1);
                }} value={statusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading && <Loader2 className="animate-spin text-blue-400 m-auto" />}
            {error && <AlertMessage message={`Ocurrió un error al cargar datos: ${error}`} />}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task: Task) => (
                        <Card key={task.id} className="shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer" onClick={() => handleOpen(task)}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                                    {task.completed ? (
                                        <UserCheck2 className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Info className="w-5 h-5 text-yellow-500" />
                                    )}
                                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                        {task.name}
                                    </span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="text-sm text-muted-foreground space-y-2">
                                <div className="flex items-start gap-2">
                                    <ClipboardList className="w-4 h-4 mt-1 text-gray-500" />
                                    <p>
                                        <span className="font-medium text-gray-900">Descripción:</span> {task.description || '—'}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 mt-1 text-gray-500" />
                                    <p><span className="font-medium text-gray-900">Responsable:</span> {task.responsible?.name || '—'}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CalendarClock className="w-4 h-4 mt-1 text-gray-500" />
                                    <p>
                                        <span className="font-medium text-gray-900">Fecha de Entrega:</span>{' '}
                                        {task.dateCulmined ? (
                                            <>
                                                {format(parseISO(task.dateCulmined), 'yyyy-MM-dd')}{' '}
                                            </>
                                        ) : '—'}
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter className="flex items-center justify-end">
                                {getStatusBadge(task.status)}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    !isLoading && <p className="text-sm text-gray-500">No se encontraron tareas.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-gray-600 flex items-center">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                        Siguiente
                    </Button>
                </div>
            )}

            {/* Dialog */}
            {selectedTask && (
                <DialogTasks
                    open={open}
                    setOpen={setOpen}
                    task={selectedTask}
                    created_by={selectedTask.created_by?.name || "N/A"}
                    createdId={selectedTask.created_by?.id || null}
                />
            )}
        </div>
    );
};

export default TaskMe;
