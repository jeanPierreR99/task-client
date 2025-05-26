import { NavLink } from 'react-router-dom';
import NotTasks from './NotTasks';
import { dateFormatedTwo } from '../../../../../lib/date';

const Tab3 = ({ task }: any) => {
    return (
        <div className="w-full">
            {(task && task.length > 0) ? (task.map((task: any, index: number) => (
                <NavLink
                    to={"tasks"}
                    key={index}

                    className="flex w-full flex-col md:flex-row px-2 hover:bg-gray-50 md:gap-2 md:items-center justify-between border-b py-2 text-gray-500 text-sm"
                >
                    <div>
                        <span>{task.name}</span>
                    </div>
                    <span className="text-orange-400">para el {dateFormatedTwo(task.dateCulmined)}</span>
                </NavLink>
            ))
            ) : <NotTasks></NotTasks>
            }
        </div>
    );
};

export default Tab3;