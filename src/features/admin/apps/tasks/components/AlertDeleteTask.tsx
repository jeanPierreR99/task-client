import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../../../shared/components/ui/alert-dialog";
import { Button } from "../../../../../shared/components/ui/button";

type AlertDeleteTaskProps = {
    deleteTask: () => void;
};

export function AlertDeleteTask({ deleteTask }: AlertDeleteTaskProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Eliminar tarea</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de eliminar la tarea?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no puede ser restaurada. Ten en cuenta que se eliminará todo lo referente a la tarea, como las subtareas y archivos vinculados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={deleteTask}
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
