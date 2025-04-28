import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CheckCircle } from 'lucide-react';
import DialogTasks from './DialogTask';
import SheetTask from './SheetTask';
import useStoreTask, { Task as T } from '../store/useStoreTask';
import { API } from '../../../../shared/js/api';
import { ToasMessage } from '../../../../components/ToasMessage';

const convertToUTC = (dateString: string) => {
    return new Date(dateString).toISOString();
};

const convertToUTCISO = (date: Date) => {
    return new Date(date).toISOString();
}

const TabContentCalendar = () => {
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<T | null>(null);
    const [openSheet, setOpenSheet] = useState(false);
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const { categories, updateTaskById } = useStoreTask();
    const [created_by, setCreated_by] = useState("")
    const [categoryName, setCategoryName] = useState("");
    const [createdId, setCreatedId] = useState("");

    const events = categories.flatMap((label) =>
        label.tasks.map((task) => ({
            task: {
                id: task.id,
                name: task.name,
                description: task.description,
                completed: task.completed,
                status: task.status,
                dateCulmined: task.dateCulmined,
                created_by: task.created_by,
                responsible: task.responsible,
            },
            start: task.dateCulmined,
            end: task.dateCulmined,
        }))
    );

    const handleDateClick = (arg: any) => {
        setOpenSheet(true)
        setDate(convertToUTCISO(arg.date))
        setCategoryId(categories[0].id)
        setCategoryName(categories[0].title)
    };

    const handleEventDrop = async (info: any) => {
        try {
            const { event } = info;
            const movedEventDate = info.event.startStr;
            const newDateCulmined: any = { dateCulmined: convertToUTC(movedEventDate) };

            const response = await API.UpdateTask(event.extendedProps.task.id, newDateCulmined);
            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo cambiar la fecha",
                    type: "warning",
                });
                return;
            }
            ToasMessage({
                title: "Modificado",
                description: "La fecha fue modificada",
                type: "success",
            });
            updateTaskById(event.extendedProps.task.id, newDateCulmined);
        }
        catch (error) {
            console.error("Error al actualizar la tarea:", error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio un error: " + error,
                type: "error",
            });
        }
    }


    const handleOpenDialog = (task: T) => {
        setCreated_by(task.created_by.name)
        setCreatedId(task.created_by.id)
        setSelectedTask(task);
        setOpen(true);
    };

    const renderEventContent = (eventInfo: any) => {
        const { event } = eventInfo;
        const isCompleted = event.extendedProps.task.status === 'completado';
        return (
            <div
                onClick={() => handleOpenDialog(event.extendedProps.task)}
                className={`w-full mb-1 p-1 text-center rounded-md text-sm
                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-yellow-100 text-gray-900'}
                    `}
            >
                {isCompleted && <CheckCircle size={15} className="mt-1 mx-auto" />}
                <span className='whitespace-normal break-words'>{event.extendedProps.task.name}</span>
            </div>
        );
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventDrop={handleEventDrop}
                editable={true}
                droppable={true}
                locale="es"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                }}
                eventContent={renderEventContent}
            />
            {selectedTask && (
                <DialogTasks open={open} created_by={created_by} setOpen={setOpen} task={selectedTask} createdId={createdId} />
            )}
            <SheetTask title={`Se agregará una nueva tarea a su lista de tareas en la categoría "${categoryName}"`}
                createdId={createdId}
                open={openSheet}
                setOpen={setOpenSheet}
                categoryId={categoryId}
                date={date}
                form>
            </SheetTask>
        </div >
    );
};

export default TabContentCalendar;
