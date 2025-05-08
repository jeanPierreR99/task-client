import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../shared/components/ui/card";
import { Badge } from "../../../../shared/components/ui/badge";
import { Briefcase, User, Info, Search, UserCheck2, CalendarCheck, CalendarClock, Loader2 } from "lucide-react";
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


const getStatusBadge = (status: boolean) => {
    return status
        ? <Badge className="bg-green-100 text-green-800">Atendido</Badge>
        : <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
};

const AllTickets = () => {
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState('');
    const [tickets, setTickets] = useState<CreateTicketDto[]>([]);

    const {
        data,
        error,
        isLoading,
    } = useApiFetch(["all_tasks"], () => API.getTickets());

    useEffect(() => {
        if (data?.data && Array.isArray(data.data)) {
            setTickets(data.data);
        }
    }, [data]);

    useEffect(() => {
        const socket = io(API_PATH);

        socket.on('updateTicket', (eventData) => {
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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                {filteredTickets.map((ticket: CreateTicketDto, index: number) => (
                    <Card key={index} className="shadow-md border border-gray-200 hover:shadow-lg transition">
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
                            <Badge className="bg-blue-100 text-blue-800">{ticket.area}</Badge>
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
                                    {format(parseISO(ticket.createdAt), 'yyyy-MM-dd HH:mm:ss')} ({formatDistanceToNow(new Date(ticket.createdAt), {
                                        addSuffix: true,
                                        locale: es,
                                    })})
                                </p>
                            </div>
                            <div className="flex items-start gap-2">
                                <CalendarCheck className="w-4 h-4 mt-1 text-gray-500" />
                                <p><span className="font-medium text-gray-900">Fecha atendida: </span>
                                    {ticket.updatedAt
                                        ? format(parseISO(ticket.updatedAt), 'yyyy-MM-dd HH:mm:ss')

                                        : "—"} ({formatDistanceToNow(new Date(ticket.updatedAt), {
                                            addSuffix: true,
                                            locale: es,
                                        })})
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end">
                            {getStatusBadge(ticket.status)}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AllTickets;
