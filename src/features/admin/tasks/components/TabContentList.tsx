import { useEffect, useState } from 'react';
import { Button } from '../../../../shared/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '../../../../shared/components/ui/accordion';
import { Input } from '../../../../shared/components/ui/input';
import { TooltipWrapper } from '../../../../components/TooltipWrapper';
import { Checkbox } from '../../../../shared/components/ui/checkbox';
import DialogTasks from './DialogTask';
import SheetTask from './SheetTask';
import { TagIcon } from 'lucide-react';
import { API } from '../../../../shared/js/api';
import useStoreTask, { Category, Task } from '../store/useStoreTask';
import { GetDay } from '../../../../lib/date';
import { ToasMessage } from '../../../../components/ToasMessage';
import useStoreLogin from '../../../../shared/state/useStoreLogin';
import { useParams } from 'react-router-dom';
import useStoreNotification from '../../../../shared/state/useStoreNotification';

const TabContentList = ({ assignedCategoriesFalse, assignedCategoriesTrue }: any) => {
    const [newLabel, setNewLabel] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false)
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [created_by, setCreated_by] = useState("")
    const { categories, setCategories, removeCategory } = useStoreTask();
    const [countMe, setCountMe] = useState(0);
    const [countMeTrue, setCountMeTrue] = useState(0);
    const [createdId, setCreatedId] = useState("");
    const { id: userIdParam } = useParams<{ id: string }>();
    const { id: userIdStore } = useStoreLogin()
    const id = userIdParam ?? userIdStore;
    const { message } = useStoreNotification();

    const addLabel = async () => {

        try {
            if (newLabel.trim() === '') {
                ToasMessage({
                    title: "Advertencia",
                    description: "No se peude crear una categoría sin nombre",
                    type: "warning",
                });
                return;
            }

            const data = {
                title: newLabel,
                userId: id
            }
            const response = await API.setCategory(data)


            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo crear la categoria",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Categoria creada",
                description: "Se ha creado la categoria correctamente",
                type: "success",
            });

            const newEntry: Category = {
                id: response.data.id,
                title: response.data.title,
                index: response.data.index,
                tasks: []
            };

            setCategories((prev) => [...prev, newEntry]);
            setNewLabel('');
        } catch (error) {
            console.log("error:" + error)
            ToasMessage({
                title: "Error",
                description: "No se pudo crear la categoria",
                type: "error",
            });
        };
    }

    const handleOpen = (task: any) => {
        setSelectedTask(task);
        setCreated_by(task.created_by.name)
        setCreatedId(task.created_by.id)
        setOpen(true);
    };

    const deleteCategory = async (caregoryId: string) => {
        try {
            const response = await API.deleteCategoryByTask(caregoryId)

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo eliminar la categoria",
                    type: "warning",
                });
                return;
            }
            ToasMessage({
                title: "Eliminada",
                description: "Se ha eliminado la categoria correctamente",
                type: "success",
            });
            removeCategory(caregoryId)
        } catch (error) {
            ToasMessage({
                title: "Error",
                description: "La categoria no debe contener tarea" + error,
                type: "error",
            });
        }
    }

    useEffect(() => {
        if (assignedCategoriesFalse.length > 0) {
            const total: number = assignedCategoriesFalse.reduce((acc: number, category: any) => acc + category.tasks.length, 0);
            setCountMe(total);
        }
    }, [assignedCategoriesFalse]);

    useEffect(() => {
        if (assignedCategoriesTrue.length > 0) {
            const total: number = assignedCategoriesTrue.reduce((acc: number, category: any) => acc + category.tasks.length, 0);
            setCountMeTrue(total);
        }
    }, [assignedCategoriesTrue]);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    className='w-fit'
                    placeholder="Nueva etiqueta"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                />
                <Button onClick={addLabel} className="bg-blue-600 hover:bg-blue-700">
                    <TagIcon></TagIcon> Agregar
                </Button>
            </div>
            {message != "" && <span className='text-sm text-gray-400'>Tienes nuevas tareas recarga la página.</span>}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value='item-0'>
                    <AccordionTrigger className="flex justify-between items-center hover:no-underline hover:border-none">
                        <div className="flex gap-4 items-center">
                            <span className="font-medium text-red-600">Tareas y subtareas asignadas ({countMe})</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                        <ul className="space-y-2 ml-1">
                            {assignedCategoriesFalse.length > 0 ? (
                                assignedCategoriesFalse.map((category: Category, catIndex: number) => (
                                    category.tasks.map((task: Task, taskIndex: number) => (
                                        <li key={`${catIndex}-${taskIndex}`} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={task.completed}
                                                disabled
                                                className="border-gray-400 data-[state=unchecked]:hover:bg-green-100 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                                            />
                                            <span
                                                className={`hover:text-blue-500 hover:border-b border-blue-500 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''
                                                    }`}
                                                onClick={() => handleOpen(task)}
                                            >
                                                {task.name + " (de " + category.tasks[taskIndex].created_by.name + ")"}
                                            </span>
                                            <span
                                                className={`text-xs py-[2px] px-3 rounded-full ${task.status === 'completado'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </li>
                                    ))
                                ))
                            ) : (
                                <li className="text-gray-500 italic">Sin tareas</li>
                            )}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-1'>
                    <AccordionTrigger className="flex justify-between items-center hover:no-underline hover:border-none">
                        <div className="flex gap-4 items-center">
                            <span className="font-medium text-green-600">Tareas y subtareas completadas ({countMeTrue})</span>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="space-y-2">
                        <AccordionContent className="space-y-2">
                            <ul className="space-y-2 ml-1">
                                {assignedCategoriesTrue.length > 0 ? (
                                    assignedCategoriesTrue.map((category: Category, catIndex: number) => (
                                        category.tasks.map((task: Task, taskIndex: number) => (
                                            <li key={`${catIndex}-${taskIndex}`} className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={task.completed}
                                                    disabled
                                                    className="border-gray-400 data-[state=unchecked]:hover:bg-green-100 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                                                />
                                                <span
                                                    className={`hover:text-blue-500 hover:border-b border-blue-500 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''
                                                        }`}
                                                    onClick={() => handleOpen(task)}
                                                >
                                                    {task.name + " (de " + category.tasks[taskIndex].created_by.name + ")"}
                                                </span>
                                                <span
                                                    className={`text-xs py-[2px] px-3 rounded-full ${task.status === 'completado'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </li>
                                        ))
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">Sin tareas</li>
                                )}
                            </ul>
                        </AccordionContent>
                    </AccordionContent>

                </AccordionItem>
                {categories
                    .slice()
                    .sort((a, b) => (b.index ? 1 : 0) - (a.index ? 1 : 0))
                    .map((label, index) => (
                        <AccordionItem key={index} value={`item - ${index}`}>
                            <AccordionTrigger className="flex justify-between items-center hover:no-underline hover:border-none">
                                <div className="flex gap-4 items-center">
                                    <span className={`font-medium ${label.index == true ? "text-blue-600" : ""}`}>{label.title} ({label.tasks.length})</span>
                                    <TooltipWrapper content="Nueva tarea">
                                        <Button
                                            className="text-gray-500"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCategoryId(label.id)
                                                setCategoryName(label.title)
                                                setOpenDrawer(true);
                                            }}
                                        >
                                            +
                                        </Button>
                                    </TooltipWrapper>
                                    {label.index !== true && <TooltipWrapper content='Eliminar'>
                                        <Button onClick={(e) => {
                                            deleteCategory(label.id)
                                            e.stopPropagation()
                                        }}
                                            variant="ghost" className='text-red-500'>x</Button>
                                    </TooltipWrapper>}
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="space-y-2">
                                <ul className="space-y-2 ml-1">
                                    {categories.length > 0 ? (
                                        label.tasks.map((task, taskIndex) => (
                                            <li key={taskIndex} className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={task.completed}
                                                    disabled
                                                    className="border-gray-400 data-[state=unchecked]:hover:bg-green-100 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                                                />
                                                <span
                                                    className={`hover:text-blue-500 hover:border-b border-blue-500 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''
                                                        }`}
                                                    onClick={() => handleOpen(task)}
                                                >
                                                    {task.name + " (para " + label.tasks[taskIndex].responsible.name + ")"}
                                                </span>
                                                <span
                                                    className={`text-xs py-[2px] px-3 rounded-full ${task.status === 'completado'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500 italic">Sin tareas</li>
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
            {
                selectedTask && (
                    <DialogTasks open={open} created_by={created_by} setOpen={setOpen} task={selectedTask} createdId={createdId} />
                )
            }
            <SheetTask title={`Se agregará una nueva tarea a su lista de tareas en la categoría "${categoryName}"`}
                createdId={createdId}
                open={openDrawer}
                setOpen={setOpenDrawer}
                categoryId={categoryId}
                date={GetDay}
                form
            >
            </SheetTask>

        </div >
    );
};

export default TabContentList;
