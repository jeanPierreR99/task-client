import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogFooter
} from "../../../../../shared/components/ui/alert-dialog"
import { z } from "zod"
import { Button } from "../../../../../shared/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../shared/components/ui/form"
import { useState } from "react"
import { API } from "../../../../../shared/js/api"
import { ToasMessage } from "../../../../../components/ToasMessage"
import { PenLine } from "lucide-react"
import { TooltipWrapper } from "../../../../../components/TooltipWrapper"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { Input } from "../../../../../shared/components/ui/input"
import { GetDay } from "../../../../../lib/date"

const formSchema = z.object({
    name: z.string().min(1, "Campo requerido")
})

type FormValues = z.infer<typeof formSchema>

const ChangeName = ({ task }: any) => {
    const [loading, setLoading] = useState(false);
    const { id } = useStoreLogin();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const updateTaskName = async (data: FormValues) => {
        try {
            setLoading(true);

            const newTask = task.ticket
                ? {
                    nameTicket: data.name.toUpperCase(), update_at: GetDay(),
                }
                : {
                    name: data.name.toUpperCase(), update_at: GetDay(),
                };

            const response = await API.UpdateTask(task.id, id, newTask);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar la tarea",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Modificado",
                description: "El nombre de la tarea fue actualizado",
                type: "success",
            });

            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error: " + error,
                type: "error",
            });
            setLoading(false);
        }
    };


    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <TooltipWrapper content="Cambiar nombre de tarea">
                    <Button variant="outline">
                        <PenLine className="text-orange-500" />
                    </Button>
                </TooltipWrapper>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cambiar nombre de tarea</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ingresa el nuevo nombre para la tarea {task.ticket ? task.nameTicket : task.name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateTaskName)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de tarea</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Nuevo nombre de la tarea" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-fit bg-orange-500 hover:bg-orange-400 text-white"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Confirmar cambio"}
                        </Button>
                    </form>
                </Form>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ChangeName;
