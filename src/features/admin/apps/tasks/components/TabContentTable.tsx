import React, { useState } from 'react';
import { Button } from '../../../../../shared/components/ui/button';
import { TooltipWrapper } from '../../../../../components/TooltipWrapper';
import {
    DragDropContext,
    Droppable,
    DropResult,
} from '@hello-pangea/dnd';
import DialogTasks from './DialogTask';
import SheetTask from './SheetTask';
import useStoreTask from '../store/useStoreTask';
import { API } from '../../../../../shared/js/api';
import { ToasMessage } from '../../../../../components/ToasMessage';
import TaskItem from './TaskItem';
import { GetDay } from '../../../../../lib/date';
import { TaskPaginationControls } from './TaskPaginationControls';
import { Search } from 'lucide-react';
import { Input } from '../../../../../shared/components/ui/input';

const TabContentTable: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [categoryName, setCategoryName] = useState("Añadidas recientemente");
    const [indexCategory, setIndexCategory] = useState("");
    const { categories, setCategories } = useStoreTask();
    const [created_by, setCreated_by] = useState("")
    const [createdId, setCreatedId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const toggleTask = (labelIndex: number, taskIndex: number) => {
        setCategories(prev =>
            prev.map((label, i) =>
                i === labelIndex
                    ? {
                        ...label,
                        tasks: label.tasks.map((task, j) =>
                            j === taskIndex
                                ? {
                                    ...task,
                                    completed: !task.completed,
                                    status: !task.completed ? 'completado' : 'pendiente'
                                }
                                : task
                        )
                    }
                    : label
            )
        );
    };

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source } = result;
        if (!destination) return;

        if (
            destination.index === source.index &&
            destination.droppableId === source.droppableId
        ) return;

        const sourceLabelIndex = parseInt(source.droppableId);
        const destinationLabelIndex = parseInt(destination.droppableId);

        const newLabels = [...categories];
        const [movedTask] = newLabels[sourceLabelIndex].tasks.splice(source.index, 1);
        newLabels[destinationLabelIndex].tasks.splice(destination.index, 0, movedTask);

        setCategories(newLabels);

        try {
            const response = await API.updateTaskByCategory(movedTask.id, newLabels[destinationLabelIndex].id);
            if (!response.success && !response.data) return;

        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            ToasMessage({
                title: "Ocurrió un error",
                description: "Error al mover la tarea a otra categoría: " + error,
                type: "error",
            });
        }
    };

    const handleOpen = (task: any) => {
        setSelectedTask(task);
        setCreated_by(task.created_by?.name || "N/A")
        setCreatedId(task.created_by?.id || null)
        setOpen(true);
    };

    return (
        <div>
            <div className='my-2'>
                <TaskPaginationControls />
            </div>


            <DragDropContext onDragEnd={handleDragEnd}>

                <div className="md:w-[calc(100vw-320px)] bg-gray-100 p-4 rounded-md min-h-[60vh] mx-auto overflow-hidden overflow-x-auto">
                    <div className='pb-4 border-b'>
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <Input
                                placeholder="Buscar tarea"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 bg-gray-50"
                            />
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        {categories
                            .sort((a, b) => (b.index ? 1 : 0) - (a.index ? 1 : 0))
                            .map((label, labelIndex) => (
                                <Droppable key={labelIndex} droppableId={String(labelIndex)}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="flex-none w-80 border-r pr-2"
                                        >
                                            <div className='flex items-center gap-2'>
                                                <h3 className={`font-semibold ${label.index == true ? "text-blue-600" : ""}`}>{label.title}</h3>
                                                <TooltipWrapper content="Nueva tarea">
                                                    <Button
                                                        className="text-gray-500 hover:bg-white"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIndexCategory(label.id);
                                                            setCategoryName(label.title);
                                                            setOpenDrawer(true);
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </TooltipWrapper>
                                            </div>
                                            <ul className="space-y-2 mt-2">
                                                {label.tasks
                                                    .filter((task) =>
                                                        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        task.nameTicket?.toLowerCase().includes(searchTerm.toLowerCase())
                                                    )
                                                    .map((task, taskIndex) => (
                                                        <TaskItem
                                                            key={task.id}
                                                            task={task}
                                                            taskIndex={taskIndex}
                                                            labelIndex={labelIndex}
                                                            toggleTask={toggleTask}
                                                            handleOpen={handleOpen}
                                                        />
                                                    ))
                                                }

                                                {label.tasks.filter(task =>
                                                    task.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                ).length === 0 && (
                                                        <li className="text-gray-500 italic">Sin tareas</li>
                                                    )}
                                            </ul>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                    </div>
                </div>
            </DragDropContext>

            {selectedTask && (
                <DialogTasks open={open} created_by={created_by} setOpen={setOpen} task={selectedTask} createdId={createdId} />
            )}

            <SheetTask
                createdId={createdId}
                title={`Se agregará una nueva tarea a su lista de tareas en la categoría "${categoryName}"`}
                open={openDrawer}
                setOpen={setOpenDrawer}
                categoryId={indexCategory}
                form
                date={GetDay()}
            />
        </div>
    );
};

export default TabContentTable;
