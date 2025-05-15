import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../../../shared/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../shared/components/ui/avatar';
import { API_PATH } from '../../../../../shared/js/api';

const TaskItem = ({ task, taskIndex, handleOpen }: any) => {

    return (
        <Draggable draggableId={task.id} index={taskIndex}>
            {(provided) => (

                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={task.id} className={`${task.completed ? "bg-green-100" : "bg-yellow-100"} shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer`} onClick={() => handleOpen(task)}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                {task.ticket && task.nameTicket ? task.nameTicket : task.name}
                            </span>
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-sm text-muted-foreground space-y-2">
                    </CardContent>
                    <CardFooter className='flex gap-2'>
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={API_PATH + task.responsible.imageUrl} />
                            <AvatarFallback>{task.responsible.name}</AvatarFallback>
                        </Avatar>
                        <span className='text-gray-500 text-sm'> {task.responsible?.name || '—'} Reeys Frisancho Jean Pierre, {task.dateCulmined ?
                            <span className={task.completed ? 'line-through text-gray-500 font-bold' : ' font-bold'}>
                                ({format(parseISO(task.dateCulmined), 'yyyy-MM-dd')})
                            </span>
                            : '—'}</span>

                    </CardFooter>

                </Card >
            )}
        </Draggable >
    );
};

export default TaskItem;
