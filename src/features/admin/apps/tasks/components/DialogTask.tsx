import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "../../../../../shared/components/ui/dialog"
import React, { useEffect, useState } from "react"
import { Button } from "../../../../../shared/components/ui/button"
import { CalendarDays, CheckIcon, ChevronRight, Download, FileText, Loader2, MessageSquareText, MonitorCheck, Plus, Send, Unlock } from "lucide-react"
import { dateFormatedTwo, GetDay } from "../../../../../lib/date"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../shared/components/ui/tabs"
import SheetTask from "./SheetTask"
import { API, API_PATH } from "../../../../../shared/js/api"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { ToasMessage } from "../../../../../components/ToasMessage"
import useStoreTask from "../store/useStoreTask"
import { format, formatDistanceToNow } from "date-fns"
import ChangeResponsible from "./ChangeResponsible"
import { TooltipWrapper } from "../../../../../components/TooltipWrapper"
import { io } from "socket.io-client"
import { es } from "date-fns/locale"
import { AlertDeleteTask } from "./AlertDeleteTask"
import { Badge } from "../../../../../shared/components/ui/badge"
import { Input } from "../../../../../shared/components/ui/input"
import ChangeName from "./ChangeName"
import ChangeDate from "./ChangeDate"
import { MentionsInput, Mention } from "react-mentions";
import ChangeDescription from "./ChangeDescription"

interface Responsible {
    id: string
    name: string
    email: string
    passwordHash: string
    imageUrl: string
    roleId: string
}

export interface Subtask {
    id: string
    name: string
    completed: boolean
    dateCulmined: string;
    file: any;
    responsible: Responsible
}

export interface Comments {
    name: string
    comment: string
    date: string
}

interface Office {
    name: string;
    siglas: string
}

export interface Task {
    id: string
    name: string
    description: string
    completed: boolean
    status: string
    dateCulmined: string;
    responsible: Responsible;
    office: Office;
    nameTicket?: string | null;
    ticket?: boolean;
}

interface DialogTasksProps {
    open: boolean
    setOpen: (open: boolean) => void
    task: Task;
    created_by: string;
    createdId: string | null;
}

interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    imageUrl: string;
    roleId: string;
    active: boolean;
}

interface Activity {
    id: string;
    action: string;
    create_at: string;
    user: User;
}

const mentionInputStyle = {
    control: {
        backgroundColor: "#fff",
        fontSize: 14,
        fontWeight: "normal"
    },
    "&multiLine": {
        control: {
            minHeight: 63
        },
        highlighter: {
            padding: 9,
            border: "1px solid transparent"
        },
        input: {
            padding: 4,
        }
    },
    "&singleLine": {
        display: "inline-block",
        width: 180,
        highlighter: {
            padding: 1,
            border: "1px solid transparent"
        },
        input: {
            padding: 1,
            border: "1px solid silver"
        }
    },
    suggestions: {
        list: {
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 14
        },
        item: {
            padding: "5px 15px",
            borderBottom: "1px solid rgba(0,0,0,0.15)",
            "&focused": {
                backgroundColor: "#cee4e5"
            }
        }
    }
};

const DialogTasks: React.FC<DialogTasksProps> = ({ open, setOpen, task, created_by, createdId }) => {
    const [openSheet, setOpenSheet] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [subtaskData, setSubtaskData] = useState<Subtask[] | []>([]);
    const [loadingSubtask, setLoadingSubtask] = useState(false);
    const { updateTaskById } = useStoreTask()
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [commentsData, setCommentsData] = useState<any[]>([])
    const [labelComment, setLabelComment] = useState("");
    const [loadingComment, setLoadingComment] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([])
    const [files, setFiles] = useState<any[]>([]);
    const [loadingSubmitComment, setLoadingSubmitComment] = useState(false)
    const { id, role } = useStoreLogin()
    const handleOpenDialog = (subTask: Subtask) => {

        if (subTask) {
            setSelectedTask(subTask);
            setOpenSheet(true);
        }
    };

    const updateTaskComplete = async () => {
        try {
            const newTask = {
                completed: true,
                status: "completado",
                descriptionStatus: "Atendido",
                idUser: id,
                update_at: GetDay()
            }
            const response = await API.updateTaskCompleted(task.id, newTask)

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar la tarea",
                    type: "warning",
                });
                return;
            }
            updateTaskById(task.id, newTask);
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar la tarea:", error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
    }

    const updateTaskEnable = async () => {
        try {
            const newTask = {
                completed: false,
                status: "pendiente",
                descriptionStatus: "Aceptado",
                idUser: id,
                update_at: GetDay()
            }
            const response = await API.updateTaskCompleted(task.id, newTask)

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar la tarea",
                    type: "warning",
                });
                return;
            }
            updateTaskById(task.id, newTask);
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar la tarea:", error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
    }

    const updateTicket = async (status: string) => {
        try {
            const newTicket = {
                status: false,
                descriptionStatus: status,
                update_at: GetDay()
            }
            const response = await API.updateTicket(task.name!, newTicket)

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar la tarea",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Se actualizó el ticket",
                description: "Se actualizó el estado del ticket a " + status,
                type: "success",
            });
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar la tarea:", error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
    }

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    };


    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };


    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await API.getAllUsers(); // Asegúrate que esto te devuelve { id, name }
            const formatted = res.data.map((u: any) => ({
                id: u.id,
                display: u.name,
            }));
            setUsers(formatted);
        };
        fetchUsers();
    }, []);


    const handleComment = async () => {
        if (!labelComment.trim()) {
            ToasMessage({
                title: "Advertencia",
                description: "No se puede enviar un comentario vacío",
                type: "warning",
            });
            return;
        }
        setLoadingSubmitComment(true)
        const formData = new FormData();

        formData.append("comment", labelComment);
        formData.append("date", GetDay());
        formData.append("taskId", task.id);
        formData.append("userId", id);

        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });
        try {
            const response = await API.createComment(formData);

            if (!response.data && !response.success) {
                ToasMessage({
                    title: "Advertencia",
                    description: "No se pudo subir su comentario",
                    type: "warning",
                });
                return;
            }

            // setCommentsData((prev) => [...prev, response.data]);
            setLabelComment("");
            setSelectedFiles([])
            ToasMessage({
                title: "Registrado",
                description: "Comentario registrado",
                type: "success",
            });

        } catch (error) {
            console.log(error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error: " + error,
                type: "error",
            });
        }
        finally {
            setLoadingSubmitComment(false)
        }
    };


    const deleteTask = async () => {
        try {
            const response = await API.deleteTaskById(task.id, id);
            if (!response.data && !response.success) {
                ToasMessage({
                    title: "Advertencia",
                    description: "No se pudo eliminar la tarea",
                    type: "warning",
                });
                return
            }

        } catch (error) {
            console.log(error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
        setOpen(false)
    }

    useEffect(() => {
        setCommentsData([])
        setSubtaskData([])
        const getSubTask = async () => {
            setLoadingSubtask(true);
            try {
                const response = await API.getSubTaskByTask(task.id);
                if (response?.success) {
                    setSubtaskData(response.data);
                    const urls = response.data.map((sub: Subtask) => sub.responsible.imageUrl);
                    urls.unshift(task.responsible.imageUrl);
                    setImageUrls(urls);
                } else {
                    console.error("Error al obtener subtareas");
                }
            } catch (error) {
                console.error("Error en getSubTaskByTask:", error);
            } finally {
                setLoadingSubtask(false);
            }
        };

        const getActivities = async () => {
            setLoadingSubtask(true);
            try {
                const response = await API.getByTaskActivities(task.id);
                if (response?.success) {
                    setActivities(response.data);
                } else {
                    console.error("Error al obtener subtareas");
                }
            } catch (error) {
                console.error("Error en getSubTaskByTask:", error);
            } finally {
                setLoadingSubtask(false);
            }
        };

        const getFilesSubtasks = async () => {
            setLoadingSubtask(true);
            try {
                const response = await API.getFileByTask(task.id);
                if (response?.success) {

                    const filesOnly = response.data.comments
                        .flatMap((comment: any) => comment.files || [])
                    setFiles(filesOnly);
                } else {
                    console.error("No se encontraron subtareas con archivos");
                }
            } catch (error) {
                console.error("Error en traer las files desde task", error);
            } finally {
                setLoadingSubtask(false);
            }
        };

        const getCommentsByTask = async () => {
            setLoadingComment(true);
            try {
                const response = await API.getCommentByTask(task.id);

                if (response?.success) {

                    setCommentsData(response.data);
                } else {
                    console.error("No se encontraron los comentarios de la tarea");
                }
            } catch (error) {
                console.error("Error en traer los comenrtarios desde task", error);
            } finally {
                setLoadingComment(false);
            }
        };

        if (task.id) {
            getActivities();
            getSubTask();
            getFilesSubtasks();
            getCommentsByTask()
        }

    }, [open]);

    const [tikcketAsignedName, setTicketAsignedName] = useState("");

    const addNameTicket = async () => {
        try {
            if (!tikcketAsignedName.trim()) {
                ToasMessage({
                    title: "Alerta",
                    description: "Debe tener un nombre",
                    type: "warning",
                });
                return
            }
            const payload = {
                nameTicket: tikcketAsignedName
            }

            const response = await API.UpdateTask(task.id, id, payload);

            if (response?.success) {

                ToasMessage({
                    title: "Success",
                    description: "Se cambio el nombre de la tarea",
                    type: "success",
                });
                window.location.reload();
            } else {
                console.error("No se actualizo el nombre");
            }
        } catch (error) {
            console.error("Error en traer los comenrtarios desde task", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        } finally {
            setLoadingComment(false);
        }
    };

    useEffect(() => {
        const socket = io(API_PATH);
        socket.emit('joinTask', task.id);

        socket.on('updateComments', (data) => {
            if (data.taskId === task.id) {
                setCommentsData((prevComments) => [data.comment, ...prevComments]);
                if (!data.comment.files) { return }
                setFiles((prev) => [...data.comment.files, ...prev])
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [task.id]);

    const isAllowed = createdId === id || task.responsible?.id === id;

    const isAllowedComment = labelComment == "" || loadingSubmitComment;
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-6xl h-[80vh] md:h-[90vh] overflow-hidden p-0 flex gap-0 flex-col">
                <DialogHeader className="p-4 border-b">
                    {(createdId === id || task.responsible?.id === id) && !task.completed ? (
                        <Button
                            disabled={!isAllowed}
                            className="w-fit bg-orange-500 hover:bg-orange-400 text-white"
                            onClick={() => updateTaskComplete()}
                        >
                            <CheckIcon />
                            Marcar como completada
                        </Button>
                    ) : (
                        <Button
                            disabled={!isAllowed}
                            className="w-fit bg-orange-500 hover:bg-orange-400 text-white"
                            onClick={() => updateTaskEnable()}
                        >
                            <Unlock />
                            Habilitar
                        </Button>
                    )}
                    {task?.ticket && !task?.completed && (
                        <div className="flex gap-2">
                            <Button
                                disabled={!isAllowed}
                                className="w-fit"
                                variant="outline"
                                onClick={() => updateTicket("Aceptado")}
                            >
                                Aceptado
                            </Button>
                            <Button
                                disabled={!isAllowed}
                                className="w-fit"
                                variant="outline"
                                onClick={() => updateTicket("En proceso")}
                            >
                                En proceso
                            </Button>
                        </div>
                    )}

                </DialogHeader>
                <div className="flex-1 overflow-y-auto pt-4">
                    <div className="px-4">
                        <DialogDescription className="flex items-center text-base font-semibold text-foreground">
                            {!task.ticket ? task.name : task.nameTicket}
                            <ChevronRight size={20} className="ml-2" /><ChangeName task={task} />
                        </DialogDescription>

                        {task.ticket && !task?.nameTicket && (
                            <div className="flex gap-2 mt-2">
                                <Input placeholder="Coloque un nombre para la tarea" className="uppercase" onChange={(e) => setTicketAsignedName(e.target.value.toLocaleUpperCase())} />
                                <Button variant="outline" onClick={addNameTicket}>Actualizar</Button>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mt-4">
                            {task.status === "pendiente" ? <div className="bg-yellow-100 p-2 text-md border-l-4 border-yellow-600 text-sm text-yellow-600 font-bold">Pendiente</div>
                                : <div className="bg-green-100 p-2 text-md border-l-4 border-green-600 text-sm text-green-600 font-bold">Completado</div>}

                            {task.ticket && <div className="flex gap-2 items-center"><span className="text-sm">Código de Ticket:</span> <span className="text-sm"><Badge className="bg-blue-100 text-blue-400 font-bold">{task.name}</Badge></span></div>
                            }
                            <div className="flex gap-2 items-center"><span className="text-sm">Creado por:</span> <span className="text-sm">{created_by ? created_by : "N/A"}</span></div>
                            <div className="flex gap-2 items-center"><span className="text-sm">Responsable:</span> <span className="text-sm">{task.responsible?.name || "N/A"}</span><ChangeResponsible task={task} /></div>
                            <div className="flex gap-2 items-center"><span className="text-sm">Oficina:</span> <span className="text-sm">{task.office?.siglas || "N/ A"}</span></div>
                            <div className="flex gap-2 items-center"><span className="text-sm">Fecha de entrega:</span> <span className="text-sm text-orange-500">{`${dateFormatedTwo(task.dateCulmined)}`}</span><ChangeDate task={task} /></div>
                            <div className="flex flex-col gap-2 "><span className="text-sm">Descripcion: <ChangeDescription task={task} /></span>
                                <textarea disabled readOnly rows={3} className="border resize-none rounded-md outline-0 p-2 text-gray-400 text-sm">{task.description}</textarea>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-sm font-black">Subtareas</span>

                            {loadingSubtask && <Loader2 className="animate-spin text-blue-400 m-auto"></Loader2>}
                            {subtaskData.map((sub) => (
                                <li key={sub.id} className="flex items-center gap-2">
                                    <input type="checkbox" checked={sub.completed} readOnly />
                                    <span onClick={() => handleOpenDialog(sub)} className="text-sm hover:border-b border-blue-500 hover:text-blue-500 cursor-pointer">{sub.name}</span>
                                    <span className="text-sm">({sub.responsible.name})</span>
                                </li>
                            ))}
                        </div>
                    </div>
                    <div className="px-4  bg-gray-100 mt-4">
                        <Tabs defaultValue="comments" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 gap-4">
                                <TabsTrigger value="comments"><MessageSquareText /> <span className="hidden md:block">Comentarios</span></TabsTrigger>
                                <TabsTrigger value="activity"><MonitorCheck /> <span className="hidden md:block">Toda la actividad</span></TabsTrigger>
                                <TabsTrigger value="attachments"><FileText /> <span className="hidden md:block">Adjuntos</span></TabsTrigger>
                            </TabsList>
                            <TabsContent value="comments">
                                {loadingComment && <Loader2 className="animate-spin text-blue-400 m-auto"></Loader2>}
                                {commentsData && commentsData.length > 0 ? (
                                    <div className="space-y-4 py-4">
                                        {commentsData.map((comment, index) => (

                                            <li key={index} className="flex items-start gap-3 border-t pt-2">
                                                <img
                                                    src={API_PATH + comment.user.imageUrl}
                                                    alt="sdsd"
                                                    className="w-8 h-8 rounded-full object-cover mt-1"
                                                />
                                                <div className="flex flex-col w-full">
                                                    <span className="text-sm font-medium">{comment.user.name}</span>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: comment.comment }} />
                                                        {comment.files &&
                                                            comment.files.map((commentFile: any, index: number) => {
                                                                const url = API_PATH + commentFile.url;
                                                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(commentFile.url);
                                                                const isVideo = /\.(mp4|webm|ogg)$/i.test(commentFile.url);

                                                                return isImage ? (
                                                                    <a key={index} href={url} target="_blank" className="w-fit hover:shadow">
                                                                        <img
                                                                            className="w-[300px] max-h-[300px]"
                                                                            src={url}
                                                                            alt={`Imagen adjunta ${index + 1}`}
                                                                        />
                                                                    </a>
                                                                ) : isVideo ? (
                                                                    <video
                                                                        key={index}
                                                                        controls
                                                                        className="w-[300px] max-h-[300px] hover:shadow"
                                                                    >
                                                                        <source src={url} type="video/mp4" />
                                                                        Tu navegador no soporta la etiqueta de video.
                                                                    </video>
                                                                ) : (
                                                                    <a
                                                                        key={index}
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-orange-600 min-w-[300px] text-sm underline flex hover:shadow gap-2 items-center bg-orange-50 border-orange-200 border p-2 w-fit rounded-md"
                                                                    >
                                                                        <FileText size={40} className="bg-orange-100 p-2 rounded-md" /> {commentFile.name}
                                                                    </a>
                                                                );
                                                            })
                                                        }

                                                    </div>
                                                    <span className="text-xs text-muted-foreground text-right">    {formatDistanceToNow(new Date(comment.date), {
                                                        addSuffix: true,
                                                        locale: es,
                                                    })}</span>
                                                </div>
                                            </li>

                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm py-4">No hay comentarios para esta tarea.</div>
                                )}

                            </TabsContent>
                            <TabsContent value="activity">
                                <ul className="flex flex-col gap-3 py-4">
                                    {activities.map((activity, index) => (
                                        <li key={index} className="flex items-start gap-3 border-t pt-2">
                                            <img
                                                src={API_PATH + activity.user.imageUrl}
                                                alt={activity.user.name}
                                                className="w-8 h-8 rounded-full object-cover mt-1"
                                            />
                                            <div className="flex flex-col w-full">
                                                <span className="text-sm font-medium">{activity.user.name}</span>
                                                <span className="text-sm text-muted-foreground">{activity.action}</span>
                                                <span className="text-xs text-muted-foreground text-right">{formatDistanceToNow(new Date(activity.create_at), {
                                                    addSuffix: true,
                                                    locale: es,
                                                })}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </TabsContent>
                            <TabsContent value="attachments">
                                <div className="w-full py-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {
                                            files && files.map((file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center gap-4 p-4 rounded-md border bg-orange-50 border-orange-200 hover:shadow transition-shadow"
                                                >
                                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-md">
                                                        <FileText size={28} />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="font-medium break-words text-sm">{file.name}</p>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <CalendarDays size={14} />
                                                            {format(new Date(file.uploaded_in), "dd MMM yyyy, HH:mm")}
                                                        </div>
                                                    </div>
                                                    <a href={API_PATH + file.url} target="__blank" className="p-1 rounded hover:bg-orange-100">
                                                        <Download size={20} className="text-orange-500" />
                                                    </a>
                                                </div>
                                            ))}
                                    </div>
                                    {!files || files.length === 0 && <p className="text-center text-gray-500 text-sm">No hay archivos</p>}

                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="flex gap-4 flex-col bg-gray-100 p-4 border-t">
                    <div className="rounded-md border w-full p-2 flex flex-col bg-white">

                        <MentionsInput
                            placeholder="Escribe un comentario y menciona a alguien con @"
                            value={labelComment}
                            onChange={(e) => setLabelComment(e.target.value)}
                            style={mentionInputStyle}
                        >
                            <Mention
                                trigger="@"
                                data={users}
                                markup="<span class='formated-text'>@__display__</span>"
                                displayTransform={(_id, display) => `@${display}`}
                            />
                        </MentionsInput>


                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                            {selectedFiles.map((file, index) => {
                                const isImage = file.type.startsWith('image/');
                                const url = URL.createObjectURL(file);

                                return (
                                    <div key={index} className="relative group">
                                        {isImage ? (
                                            <img
                                                src={url}
                                                alt={file.name}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded border text-xs text-gray-600">
                                                📄
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <TooltipWrapper content="subir archivo">
                                <label className="cursor-pointer">
                                    <Plus className="text-orange-500" />
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </TooltipWrapper>

                            <Button
                                disabled={isAllowedComment}
                                className="w-fit float-right bg-orange-500 hover:bg-orange-400"
                                onClick={handleComment}
                            >
                                {loadingSubmitComment && (
                                    <Loader2 className="animate-spin text-white m-auto" />
                                )}
                                <Send /> Comentar
                            </Button>
                        </div>
                    </div>


                    <div className="flex md:flex-row flex-col gap-2 justify-between">
                        <div className="flex gap-2 items-center text-gray-400 text-sm">
                            <span className="mr-4">Colaboradores</span>
                            {imageUrls && imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    className="w-12 h-12 -ml-4 border-3 border-gray-100 rounded-full"
                                    src={API_PATH + url}
                                    alt={index.toString()}
                                />
                            ))}
                        </div>
                        {role == "Administrador" &&
                            <AlertDeleteTask deleteTask={deleteTask} />
                        }

                    </div>
                </div>
            </DialogContent>
            {selectedTask && (<SheetTask createdId={createdId ? createdId : null} title="Contenido de la subtarea imagenes, archivos, videos, etc y registro de toda la actividad relacionada con esta." open={openSheet} setOpen={setOpenSheet} subTask={selectedTask} setSubtask={setSubtaskData}></SheetTask>)}
        </Dialog >
    )
}

export default DialogTasks