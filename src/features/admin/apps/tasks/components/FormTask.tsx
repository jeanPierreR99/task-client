import React, { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "../../../../../shared/components/ui/form"
import { Input } from "../../../../../shared/components/ui/input"
import { Button } from "../../../../../shared/components/ui/button"
import { Textarea } from "../../../../../shared/components/ui/textarea"
import { formatDateToSpanish, GetDay } from "../../../../../lib/date"
import { Calendar1Icon, Plus, X } from "lucide-react"
import { Calendar } from "../../../../../shared/components/ui/calendar"
import { UserAutoComplete } from "./UserAutocomplete"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { API } from "../../../../../shared/js/api"
import { ToasMessage } from "../../../../../components/ToasMessage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../shared/components/ui/select"

export interface IcreateTask {
    name: string;
    description: string;
    completed: boolean;
    created_by: string;
    status: string;
    dateCulmined: string;
    responsibleId: string;
    categoryId: string;
    officeId: string;
}

export interface IcreateSubtask {
    name: string;
    completed: boolean;
    dateCulmined: string;
    taskId: string;
    responsibleId: string;
}

interface Office {
    id: string;
    name: string;
    siglas: string
}

const subtaskSchema = z.object({
    name: z.string().min(1, "Campo requerido"),
    responsible: z.string().min(1, "Campo requerido"),
})

const taskSchema = z.object({
    name: z.string().min(1, "Campo requerido"),
    description: z.string().min(1, "Campo requerido"),
    responsible: z.string().min(1, "Campo requerido"),
    dateCulmined: z.string().min(1, "Campo requerido"),
    officeId: z.string().min(1, "Campo requerido"),
    subtasks: z.array(subtaskSchema),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskFormProps {
    categoryId: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    date: string
}

const TaskForm: React.FC<TaskFormProps> = ({ categoryId, setOpen, date }) => {
    const { id } = useStoreLogin()


    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            dateCulmined: date,
            subtasks: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        name: "subtasks",
        control: form.control,
    })

    const [showCalendar, setShowCalendar] = useState(false)
    const [userId, setUserId] = useState<string>()
    const [subtaskUserIds, setSubtaskUserIds] = useState<string[]>([])
    const [office, setOffice] = useState<Office[]>([])


    const onSubmit = async (data: TaskFormValues) => {
        try {
            const { subtasks, responsible, ...cleanData } = data;

            const newTask: IcreateTask = {
                ...cleanData,
                completed: false,
                status: "pendiente",
                responsibleId: userId!,
                categoryId: categoryId,
                created_by: id,
            };

            const response = await API.createTask(newTask);
            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo crear la tarea",
                    type: "warning",
                });
                return;
            }

            const taskId = response.data.id;

            const subtasksToSend = subtasks.map((st, index) => ({
                name: st.name,
                completed: false,
                dateCulmined: GetDay(),
                taskId: taskId,
                responsibleId: subtaskUserIds[index],
            }));

            const hasInvalidResponsible = subtasksToSend.some(sub => !sub.responsibleId);
            if (hasInvalidResponsible) {
                ToasMessage({
                    title: "Error",
                    description: "Todas las subtareas deben tener un responsable asignado",
                    type: "warning",
                });
                return;
            }

            if (subtasksToSend.length > 0) {
                await Promise.all(subtasksToSend.map(sub => {
                    const response = API.createSubTask(sub)
                    console.log(response)
                }));
            }

            form.reset();
            setOpen(false);

        } catch (error) {
            console.error("Error al crear la tarea:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
    };

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const response = await API.getOffices();
                if (response?.data && response?.success)
                    setOffice(response.data);
            } catch (err: any) {
                console.log(err)
            }
        };
        fetchOffices();
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Fecha */}
                <FormField
                    control={form.control}
                    name="dateCulmined"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Fecha de entrega</FormLabel>

                            <div className="flex gap-2 items-center">
                                <FormControl>
                                    <Input
                                        hidden
                                        value={field.value}
                                        disabled
                                        className="bg-gray-100"
                                    />

                                </FormControl>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-fit text-gray-500"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                >
                                    <Calendar1Icon />

                                </Button>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatDateToSpanish(field.value)}
                                </p>
                            </div>

                            {showCalendar && (
                                <div className="mt-2">
                                    <Calendar
                                        className="border"
                                        mode="single"
                                        selected={new Date(field.value)}
                                        onSelect={(date) => {
                                            if (date) {
                                                field.onChange(date.toISOString())
                                                setShowCalendar(false)
                                            }
                                        }}
                                        initialFocus
                                    />
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Nombre */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Nombre</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Ej. control semanal"
                                    className="uppercase"
                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* OFICINA */}

                <FormField
                    control={form.control}
                    name="officeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Oficina</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value ?? ""}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una oficina" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {office && office.map((offi: Office, index) =>
                                            <SelectItem className="cursor-pointer hover:bg-gray-50" key={index} value={offi.id}>{offi.siglas}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Descripción */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Descripción</FormLabel>
                            <FormControl>
                                <Textarea rows={3} {...field} placeholder="Detalles sobre la tarea..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Responsable */}
                <FormField
                    control={form.control}
                    name="responsible"
                    render={({ field }) => (
                        <FormItem className="relative">
                            <FormLabel className="text-gray-700">Responsable</FormLabel>
                            <FormControl>
                                <UserAutoComplete field={field} setUserId={setUserId} />
                            </FormControl>
                            {(!userId || userId === "") && (
                                <span className="text-xs text-gray-400">Sin responsable</span>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Subtareas */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Subtareas</h3>
                        <Button
                            variant="ghost"
                            type="button"
                            size="sm"
                            onClick={() => {
                                append({ name: "", responsible: "" });
                                setSubtaskUserIds(prev => [...prev, ""]);
                            }}

                            className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
                        >
                            <Plus size={16} /> Añadir
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="relative border rounded-md p-4 bg-gray-50">
                                <div className="flex gap-4 flex-col">
                                    <FormField
                                        control={form.control}
                                        name={`subtasks.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Nombre</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`subtasks.${index}.responsible`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Responsable</FormLabel>
                                                <FormControl>
                                                    <UserAutoComplete
                                                        field={field}
                                                        setUserId={(id) => {
                                                            const updated = [...subtaskUserIds];
                                                            updated[index] = id;
                                                            setSubtaskUserIds(updated);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                    onClick={() => {
                                        remove(index);
                                        setSubtaskUserIds(prev => prev.filter((_, i) => i !== index));
                                    }}

                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={!userId || userId === ""} className="w-full bg-orange-500 hover:bg-orange-400">
                    Agregar tarea
                </Button>
            </form>
        </Form>
    )
}

export default TaskForm
