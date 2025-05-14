import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogDescription
} from "../../../../../shared/components/ui/alert-dialog"
import { Button } from "../../../../../shared/components/ui/button"
import { useState } from "react"
import { API } from "../../../../../shared/js/api"
import { ToasMessage } from "../../../../../components/ToasMessage"
import { CalendarSync, Loader2, } from "lucide-react"
import { TooltipWrapper } from "../../../../../components/TooltipWrapper"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { GetDay } from "../../../../../lib/date"
import { Calendar } from "../../../../../shared/components/ui/calendar"


const ChangeDate = ({ task }: any) => {
    const { id } = useStoreLogin();
    const [loading, setLoading] = useState(false);

    const updateTaskDate = async (data: any) => {
        try {
            setLoading(true);

            const newTask = {
                dateCulmined: data, update_at: GetDay(),
            }

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
                <TooltipWrapper content="Cambiar fecha de entrega">
                    <Button variant="outline">
                        <CalendarSync className="text-orange-500" />
                    </Button>
                </TooltipWrapper>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cambiar Fecha</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se actulizará la fecha de entrega de la tarea {task.ticket ? task.nameTicket : task.name}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Calendar
                    mode="single"
                    selected={new Date(task.dateCulmined)}
                    onSelect={(date) => {
                        if (date) {
                            updateTaskDate(date.toISOString())
                        }
                    }}
                    initialFocus
                />
                {loading && <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/60">
                    <Loader2 className="animate-spin text-orange-500" />
                </div>}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ChangeDate;
