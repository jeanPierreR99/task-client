import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../shared/components/ui/card';
import { format, parseISO } from 'date-fns';

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
                        <div className="flex items-start gap-2">
                            <p><span className="font-medium text-gray-900">Responsable:</span> {task.responsible?.name || '—'}</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <p>
                                <span className="font-medium text-gray-900">Fecha de entrega:</span>{' '}
                                {task.dateCulmined ? (
                                    <>
                                        {format(parseISO(task.dateCulmined), 'yyyy-MM-dd')}{' '}
                                    </>
                                ) : '—'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                // <li
                //     ref={provided.innerRef}
                //     {...provided.draggableProps}
                //     {...provided.dragHandleProps}
                //     className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded shadow-sm mb-2"
                // >
                //     <Checkbox
                //         checked={task.completed}
                //         disabled
                //         onCheckedChange={() => toggleTask(labelIndex, taskIndex)}
                //         className="border-gray-400 data-[state=unchecked]:hover:bg-green-100 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                //     />
                //     <span
                //         className={`cursor-pointer text-sm text-gray-500 ${task.completed ? 'line-through text-gray-500' : ''
                //             } hover:text-blue-500 hover:border-b border-blue-500`}
                //         onClick={() => handleOpen(task)}
                //     >
                //         {task.ticket && task.nameTicket ? task.nameTicket : task.name}
                //     </span>
                //     <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'completado'
                //         ? 'bg-green-100 text-green-700'
                //         : 'bg-yellow-100 text-yellow-700'
                //         }`}
                //     >
                //         {task.status}
                //     </span>
                // </li>
            )}
        </Draggable>
    );
};

export default TaskItem;
