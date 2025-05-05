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
import { UserAutoComplete } from "./UserAutocomplete"
import { useEffect, useState } from "react"
import { API } from "../../../../../shared/js/api"
import { ToasMessage } from "../../../../../components/ToasMessage"
import { UserRoundPen } from "lucide-react"
import { TooltipWrapper } from "../../../../../components/TooltipWrapper"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { GetDay } from "../../../../../lib/date"

const formSchema = z.object({
    responsible: z.string().min(1, "Campo requerido")
})

type FormValues = z.infer<typeof formSchema>

const ChangeResponsible = ({ task }: any) => {
    const [userId, setUserId] = useState("")
    const [loading, setLoading] = useState(false)
    const { id } = useStoreLogin();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            responsible: ""
        }
    })

    const updateTaskResponsible = async () => {
        try {
            setLoading(true)

            const newTask = {
                responsibleId: userId,
                dateAux: GetDay

            }
            const response = await API.UpdateTask(task.id, id, newTask)
            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar la tarea",
                    type: "warning",
                });
                return;
            }
            window.location.reload()
            ToasMessage({
                title: "Modificado",
                description: "La tarea fue cambiada de responsable",
                type: "success",
            });
            setLoading(false)
        } catch (error) {
            console.error("Error al actualizar la tarea:", error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
            setLoading(false)
        }
    }
    useEffect(() => {
        if (task) {
            form.setValue("responsible", "")
        }
    }, [task, form])


    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <TooltipWrapper content="Cambiar de responsable">
                    <Button variant="outline"><UserRoundPen className="text-orange-500" /></Button>
                </TooltipWrapper>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cambiar responsable</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ingresa el nombre del nuevo responsable. Este cambio no puede deshacerse y la tarea se eliminará completamente de su lista de tareas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateTaskResponsible)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="responsible"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsable</FormLabel>
                                    <FormControl>
                                        <UserAutoComplete field={field} setUserId={setUserId} />
                                    </FormControl>
                                    {!userId && (
                                        <span className="text-xs text-gray-400">Sin responsable seleccionado</span>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-fit bg-orange-500 hover:bg-orange-400 text-white"
                            disabled={!userId || loading}
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
    )
}
export default ChangeResponsible