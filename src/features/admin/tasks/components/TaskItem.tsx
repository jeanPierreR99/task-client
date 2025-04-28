import { Draggable } from '@hello-pangea/dnd';
import { Checkbox } from '../../../../shared/components/ui/checkbox';

const TaskItem = ({ task, taskIndex, labelIndex, toggleTask, handleOpen }: any) => {
    return (
        <Draggable draggableId={task.id} index={taskIndex}>
            {(provided) => (
                <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded shadow-sm mb-2"
                >
                    <Checkbox
                        checked={task.completed}
                        disabled
                        onCheckedChange={() => toggleTask(labelIndex, taskIndex)}
                        className="border-gray-400 data-[state=unchecked]:hover:bg-green-100 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white"
                    />
                    <span
                        className={`cursor-pointer text-sm text-gray-500 ${task.completed ? 'line-through text-gray-500' : ''
                            } hover:text-blue-500 hover:border-b border-blue-500`}
                        onClick={() => handleOpen(task)}
                    >
                        {task.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'completado'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                        {task.status}
                    </span>
                </li>
            )}
        </Draggable>
    );
};

export default TaskItem;
