import { useState } from 'react';
import { Button } from '../../../../../shared/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '../../../../../shared/components/ui/accordion';
import { Input } from '../../../../../shared/components/ui/input';
import { TooltipWrapper } from '../../../../../components/TooltipWrapper';
import { Checkbox } from '../../../../../shared/components/ui/checkbox';
import DialogTasks from './DialogTask';
import SheetTask from './SheetTask';
import { Search, TagIcon } from 'lucide-react';
import { API } from '../../../../../shared/js/api';
import useStoreTask, { Task } from '../store/useStoreTask';
import { GetDay } from '../../../../../lib/date';
import { ToasMessage } from '../../../../../components/ToasMessage';
import useStoreLogin from '../../../../../shared/state/useStoreLogin';
import useStoreNotification from '../../../../../shared/state/useStoreNotification';
import ChangeNameCategory from './ChangeNameCategory';
import { TaskPaginationControls } from './TaskPaginationControls';
import DownloadProject from './DownloadProject';
import { useParams } from 'react-router-dom';

const TabContentList = () => {
    const [newLabel, setNewLabel] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false)
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [created_by, setCreated_by] = useState("")
    const { categories, findTasksByName } = useStoreTask();
    const [createdId, setCreatedId] = useState("");
    const { projectId, role } = useStoreLogin()
    const { message } = useStoreNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const { id } = useParams<{ id: string | undefined }>();

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
                projectId: projectId
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
        setCreated_by(task.created_by?.name || "N/A")
        setCreatedId(task.created_by?.id || null)
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
        } catch (error) {
            ToasMessage({
                title: "Error",
                description: "La categoria no debe contener tarea" + error,
                type: "error",
            });
        }
    }


    const taskFound = findTasksByName(searchTerm)

    return (
        <div className="space-y-4">
            <div className="flex gap-2 max-w-sm">
                <Input
                    className=''
                    placeholder="Nueva etiqueta"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                />
                <Button onClick={addLabel} className="bg-orange-500 hover:bg-orange-400">
                    <TagIcon></TagIcon> Agregar
                </Button>
            </div>

            <TaskPaginationControls
            />
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <Input
                    placeholder="Buscar tarea"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                />
            </div>
            {taskFound.length > 0 && <div>
                <span className='text-sm text-gray-400'>Lista de sugerencias</span>
                <div className='flex flex-col gap-1'>
                    {
                        taskFound.map((data, index) =>
                            <li key={`${data.id}-${index}`} className="flex items-center gap-2">
                                <Checkbox
                                    checked={data.completed}
                                    disabled
                                    className="border-gray-400 data-[state=unchecked]:hover:bg-green-100 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                                />
                                <span
                                    className={`hover:text-blue-500 text-sm hover:border-b border-blue-500 cursor-pointer ${data.completed ? 'line-through text-gray-500' : ''
                                        }`}
                                    onClick={() => handleOpen(data)}
                                >
                                    {(data.ticket && data.nameTicket ? data.nameTicket : data.name) + " (para " + data.responsible?.name + ")"}
                                </span>
                                <span
                                    className={`text-xs py-[2px] px-3 rounded-full ${data.status === 'completado'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {data.status}
                                </span>
                            </li>
                        )
                    }
                </div>
            </div>}

            {message != "" && <span className='text-sm text-gray-400'>Tienes nuevas tareas recarga la página.</span>}
            <Accordion type="single" collapsible className="w-full">
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
                                    <TooltipWrapper content="Cambiar nombre de categoría">
                                        <ChangeNameCategory category={label} />
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
                                                    {(task.ticket && task.nameTicket ? task.nameTicket : task.name) + " (para " + task.responsible?.name + ")"}
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
            <div className='flex justify-end gap-2'>
                <TooltipWrapper content='Nueva tarea'>
                    <Button onClick={() => {
                        const catFilter = categories.find(cat => cat.index);

                        setCategoryId(catFilter!.id)
                        setCategoryName(catFilter!.title)
                        setOpenDrawer(true);
                    }}
                        className='w-[80px] h-[80px] hover:bg-orange-400 bg-orange-500 text-white  duration-300 ease-out rounded-full text-5xl relative'>
                        <span className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>+</span>
                    </Button>
                </TooltipWrapper>
            </div>
            {
                role === "Administrador" && <div className='float-right'>
                    <DownloadProject id={id} />
                </div>
            }
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
                date={GetDay()}
                form
            >
            </SheetTask>

        </div >
    );
};

export default TabContentList;
