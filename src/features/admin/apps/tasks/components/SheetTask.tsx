import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../../../../../shared/components/ui/sheet";
import React from "react";
import FormTask from "./FormTask";
import { Subtask } from "./DialogTask";
import ViewSubTask from "./ViewSubTask";

interface SheetTaskProps {
    createdId: string | null;
    title: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    categoryId?: string;
    subTask?: Subtask;
    date?: string;
    form?: boolean;
    setSubtask?: any
}

const SheetTask: React.FC<SheetTaskProps> = ({
    createdId,
    title,
    open,
    setOpen,
    form,
    subTask,
    categoryId,
    date,
    setSubtask
}) => {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{form ? "Agregar nueva tarea" : "Información de la sub tarea"}</SheetTitle>
                    <SheetDescription className="text-red-500">
                        {title}
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 p-4">
                    {form && categoryId && date ? (
                        <FormTask categoryId={categoryId} setOpen={setOpen} date={date} />
                    ) : (
                        subTask ? (
                            <ViewSubTask setOpen={setOpen} createdId={createdId ? createdId : null} subTask={subTask} setSubtask={setSubtask} />
                        ) : (
                            <p>No hay subtarea para ver</p>
                        )
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SheetTask;
