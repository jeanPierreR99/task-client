import React, { useEffect, useState } from 'react';
import { Subtask } from './DialogTask';
import { DialogDescription } from '../../../../../shared/components/ui/dialog';
import { CalendarDays, CheckIcon, ChevronRight, Download, FileText, Search, Unlock } from 'lucide-react';
import { dateFormatedTwo, getRelativeDay } from '../../../../../lib/date';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../shared/components/ui/accordion';
import FormSubTask from './FormSubTask';
import useStoreLogin from '../../../../../shared/state/useStoreLogin';
import { Button } from '../../../../../shared/components/ui/button';
import { API, API_PATH } from '../../../../../shared/js/api';
import { format } from 'date-fns';
import { ToasMessage } from '../../../../../components/ToasMessage';
import { File } from '../store/useStoreFile';
import { useParams } from 'react-router-dom';

interface ViewSubTaskProp {
    setOpen: (open: boolean) => void
    subTask: Subtask;
    createdId: string;
    setSubtask: any
}

const ViewSubTask: React.FC<ViewSubTaskProp> = ({ setOpen, subTask, createdId, setSubtask }) => {
    const [search, setSearch] = useState("")
    const [subtaskFile, setSubtaskFile] = useState<File[] | []>([])
    const { id: userIdParam } = useParams<{ id: string }>();
    const { id: userIdStore } = useStoreLogin()

    const id = userIdParam ?? userIdStore;

    const isAllowed = createdId === id || subTask.responsible.id === id;

    const filteredFiles = subtaskFile.filter((file: any) =>
        file.name?.toLowerCase().includes(search.toLowerCase())
    )

    const updateSubTaskComplete = async (status: boolean) => {
        try {
            const newSubTask = {
                completed: status,
            }
            const response = await API.updateSubTask(subTask.id, newSubTask)

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo crear la tarea",
                    type: "warning",
                });
                return;
            }
            setOpen(false);
            setSubtask((prevSubtask: any) =>
                prevSubtask.map((sub: any) =>
                    sub.id === subTask.id ? { ...sub, completed: status } : sub
                )
            );
            ToasMessage({
                title: "Modificado",
                description: "Se modifico la subtarea",
                type: "success",
            });
        } catch (error) {
            console.error("Error al actualizar la tarea:", error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
    }

    useEffect(() => {
        const getFiles = async () => {
            const response = await API.getFileBySubTask(subTask.id)
            setSubtaskFile(response.data)
        }
        getFiles()
    }, [])

    return (
        <div className="">
            <div className='mb-2'>
                {(subTask.responsible.id === id || createdId === id) && !subTask.completed ? (
                    <Button
                        disabled={!isAllowed}
                        className="w-fit"
                        onClick={() => updateSubTaskComplete(true)}
                        variant="outline"
                    >
                        <CheckIcon />
                        Marcar como completada
                    </Button>
                ) : (
                    <Button
                        disabled={!isAllowed}
                        className="w-fit"
                        onClick={() => updateSubTaskComplete(false)}
                        variant="outline"
                    >
                        <Unlock />
                        Habilitar
                    </Button>
                )}
            </div>
            <DialogDescription className="flex items-center text-base font-semibold text-foreground">
                {subTask.name}
                <ChevronRight size={20} className="ml-2" />
            </DialogDescription>
            <div className="flex flex-col gap-2 mt-4">
                {!subTask.completed ? <span className="text-sm bg-yellow-100 text-yellow-700 w-fit py-[2px] px-3 rounded-full">pendiente</span>
                    : <span className="text-sm bg-green-100 text-green-700 w-fit py-[2px] px-3 rounded-full">cumplido</span>
                }

                <div className="flex gap-2 items-center">
                    <span className="text-sm">Responsable:</span>
                    <span className="text-sm">{subTask.responsible.name}</span>
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-sm">Fecha de entrega:</span>
                    <span className="text-sm text-green-500">
                        {`${dateFormatedTwo(subTask.dateCulmined)} (${getRelativeDay(subTask.dateCulmined)})`}
                    </span>
                </div>
                {
                    (subTask.responsible.id == id || createdId == id) && <FormSubTask subTaskId={subTask.id} setSubtaskFile={setSubtaskFile}></FormSubTask>
                }

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="hover:no-underline">Adjuntos</AccordionTrigger>
                        <AccordionContent>
                            <div className="relative max-w-sm mb-4">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar archivo..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
                                />
                            </div>
                            {subtaskFile && subtaskFile.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    {filteredFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center gap-4 p-4 rounded-md border bg-orange-50  border-orange-200 hover:shadow transition-shadow"
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
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

            </div>
        </div>
    );
};

export default ViewSubTask;
