import { AlertMessage } from "../../../../../components/AlertMessage";
import NotTasks from "./NotTasks";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Task } from "../../tasks/store/useStoreTask";
import useApiFetch from "../../../../../hooks/useApiFetch";
import { API } from "../../../../../shared/js/api";
import useStoreLogin from "../../../../../shared/state/useStoreLogin";
import { dateFormatedTwo } from "../../../../../lib/date";

const Tab1 = () => {
    const { projectId } = useStoreLogin();
    const [assignedCategoriesFalse, setAssignedCategoriesFalse] = useState<Task[]>([]);

    const {
        data: responsibleCategoriesFalse,
        error: responsibleErrorFalse,
        isLoading: responsibleLoadingFalse
    } = useApiFetch(
        ["categories_by_responsible_false", projectId],
        () => API.getTasksStatusUser(projectId, "true")
    );

    useEffect(() => {
        if (responsibleCategoriesFalse?.data) {
            setAssignedCategoriesFalse(responsibleCategoriesFalse.data);
        }
    }, [responsibleCategoriesFalse]);

    if (responsibleErrorFalse) {
        return <AlertMessage message={`Error al cargar: ${String(responsibleErrorFalse.message || responsibleErrorFalse)}`} />;
    }

    if (responsibleLoadingFalse) {
        return <p className="text-gray-400">Cargando...</p>;
    }

    return (
        <div className="w-full">
            {assignedCategoriesFalse.length > 0 ? (
                assignedCategoriesFalse.map((task: Task, taskIndex: number) => (
                    <NavLink
                        to="tasks"
                        key={taskIndex}
                        className="flex flex-col md:flex-row w-full px-2 hover:bg-gray-50 md:gap-2 md:items-center justify-between border-b py-2 text-gray-500 text-sm"
                    >
                        <div className="">
                            <span>{task.name}</span>
                        </div>
                        <span className="text-green-400"> para el {dateFormatedTwo(task.dateCulmined)}</span>
                    </NavLink>
                ))
            ) : (
                <NotTasks />
            )}
        </div>
    );
};

export default Tab1;
