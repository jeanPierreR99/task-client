import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../shared/components/ui/card";
import { Badge } from "../../../../shared/components/ui/badge";
import { Briefcase, User, Info, Search, UserCheck2, CalendarCheck, CalendarClock, Loader2, Eraser } from "lucide-react";
import { Input } from "../../../../shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../shared/components/ui/select";
import useApiFetch from "../../../../hooks/useApiFetch";
import { API, API_PATH } from "../../../../shared/js/api";
import { CreateTicketDto } from "../../../../shared/js/interface";
import { AlertMessage } from "../../../../components/AlertMessage";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { io } from "socket.io-client";
import { es } from "date-fns/locale/es";
import { Button } from "../../../../shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Pendiente':
            return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
        case 'Aceptado':
            return <Badge className="bg-blue-100 text-blue-800">Aceptado</Badge>;
        case 'En proceso':
            return <Badge className="bg-orange-100 text-orange-800">En proceso</Badge>;
        case 'Atendido':
            return <Badge className="bg-green-100 text-green-800">Atendido</Badge>;
        default:
            return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
};

const getCardBorderClass = (status: string) => {
    switch (status) {
        case 'Normal':
            return 'border-gray-200';
        case 'Moderado':
            return 'border-yellow-200 bg-yellow-50/40';
        case 'Urgente':
            return 'border-red-200 bg-red-50/40';
        default:
            return 'border-gray-200';
    }
};


const AllTickets = () => {
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState('');
    const [tickets, setTickets] = useState<CreateTicketDto[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const {
        data,
        error,
        isLoading,
    } = useApiFetch(["all_tasks"], () => API.getTickets());



    const handleChange = async (ticketId: string, value: string) => {
        try {
            const payload = {
                status_string: value,
            }
            await API.updateTicket(ticketId, payload);

        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    useEffect(() => {
        if (data?.data && Array.isArray(data.data)) {
            setTickets(data.data);
        }
    }, [data]);

    useEffect(() => {
        const socket = io(API_PATH);

        socket.on('updateTicket', (eventData) => {
            console.log(eventData)
            setTickets((prev) => {
                const updated = eventData.data;
                const existingIndex = prev.findIndex((ticket: any) => ticket.id === updated.id);

                if (existingIndex !== -1) {
                    const copy = [...prev];
                    copy[existingIndex] = updated;
                    return copy;
                } else {
                    return [updated, ...prev];
                }
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const filteredTickets = tickets.filter((ticket: CreateTicketDto) => {
        const matchesSearch = ticket.code?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "pending" && !ticket.status) ||
            (statusFilter === "completed" && ticket.status);

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div>
            <span className="text-sm text-gray-400">Todos los Tickets</span>
            <br /><br />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <Input
                        placeholder="Buscar por código"
                        className="pl-10 pr-4"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="completed">Atendido</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading && <Loader2 className="animate-spin text-blue-400 m-auto" />}
            {error && <AlertMessage message={`Ocurrió un error al cargar datos: ${error}`} />}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentTickets.length > 0 ? (currentTickets.map((ticket: CreateTicketDto, index: number) => (
                    // <Card key={index} className="shadow-md border border-gray-200 hover:shadow-lg transition">
                    <Card
                        key={index}
                        className={`shadow-md border hover:shadow-lg transition ${getCardBorderClass(ticket.status_string)}`}
                    >

                        <CardHeader className="flex flex-col pb-2">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                                {!ticket.status ? (
                                    <div className="flex items-center gap-2">
                                        <Info className="w-5 h-5 text-yellow-500" />
                                        {ticket.code}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserCheck2 className="w-5 h-5 text-green-500" />
                                        {ticket.code}
                                    </div>
                                )}
                            </CardTitle>
                            <span className="bg-blue-100 text-blue-800 py-1 px-2 text-xs font-medium rounded-lg">{ticket.area}</span>
                        </CardHeader>

                        <CardContent className="text-sm text-muted-foreground space-y-2">
                            <div className="flex items-start gap-2">
                                <Briefcase className="w-4 h-4 mt-1 text-gray-500" />
                                <p><span className="font-medium text-gray-900">Descripción:</span> {ticket.description}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <User className="w-4 h-4 mt-1 text-gray-500" />
                                <p><span className="font-medium text-gray-900">Pedido por:</span> {ticket.requestedBy}</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CalendarClock className="w-4 h-4 mt-1 text-gray-500" />
                                <p><span className="font-medium text-gray-900">Fecha de solicitud: </span>
                                    {format(parseISO(ticket.create_at), 'yyyy-MM-dd HH:mm:ss')} ({formatDistanceToNow(new Date(ticket.create_at), {
                                        addSuffix: true,
                                        locale: es,
                                    })})
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CalendarCheck className="w-4 h-4 mt-1 text-gray-500" />
                                <p><span className="font-medium text-gray-900">Fecha atendida: </span>
                                    {ticket.update_at && ticket.status == true ? (
                                        <>
                                            {format(parseISO(ticket.update_at), 'yyyy-MM-dd HH:mm:ss')}{' '}
                                            ({formatDistanceToNow(new Date(ticket.update_at), {
                                                addSuffix: true,
                                                locale: es,
                                            })})
                                        </>
                                    ) : (
                                        '—'
                                    )}
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Eraser className="w-4 h-4 mt-1 text-gray-500" />
                                <p className="flex gap-2 items-center"><span className="font-medium text-gray-900">Estado: </span>
                                    <Select
                                        value={ticket.status_string}
                                        onValueChange={(newValue) => handleChange(ticket.code, newValue)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                            <SelectItem value="Moderado">Moderado</SelectItem>
                                            <SelectItem value="Urgente">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>

                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end">
                            {getStatusBadge(ticket.descriptionStatus)}
                        </CardFooter>
                    </Card>
                ))) : (!isLoading && <p className="text-sm text-gray-500">No se encontraron tickets.</p>)}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AllTickets;
