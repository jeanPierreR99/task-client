import { useEffect, useState } from 'react';
import { TabTasks } from './components/TabTasks';
import { API } from '../../../shared/js/api';
import useStoreLogin from '../../../shared/state/useStoreLogin';
import useApiFetch from '../../../hooks/useApiFetch';
import useStoreTask, { Task } from './store/useStoreTask';
import useStoreFile from './store/useStoreFile';
import { AlertMessage } from '../../../components/AlertMessage';
import { useParams } from 'react-router-dom';

const Tasks = () => {
    const { id: userIdParam } = useParams<{ id: string }>();
    const [assignedCategoriesFalse, setAssignedCategoriesFalse] = useState<Task | []>([]);
    const [assignedCategoriesTrue, setAssignedCategoriesTrue] = useState<Task | []>([]);
    const { setFiles } = useStoreFile()

    const { id } = useStoreLogin();
    const { setCategories } = useStoreTask();

    const userId = userIdParam ?? id;

    const {
        data: ownCategories,
        error: ownError,
        isLoading: ownLoading
    } = useApiFetch(
        ["categories_by_user", userId],
        () => API.getCategoryByUser(userId)
    );

    const {
        data: responsibleCategoriesFalse,
        error: responsibleErrorFalse,
        isLoading: responsibleLoadingFalse
    } = useApiFetch(
        ["categories_by_responsible_false", userId],
        () => API.getCategoryByResponsible(userId, "false")
    );

    const {
        data: responsibleCategoriesTrue,
        error: responsibleErrorTrue,
        isLoading: responsibleLoadingTrue
    } = useApiFetch(
        ["categories_by_responsible_true", userId],
        () => API.getCategoryByResponsible(userId, "true")
    );

    const {
        data: fileUsers,
        error: fileUsersError,
        isLoading: fileUsersLoading
    } = useApiFetch(
        ["file_user", userId],
        () => API.getFilesByUserId(userId)
    );

    useEffect(() => {
        if (ownCategories?.data) {
            setCategories(ownCategories.data);
        }
    }, [ownCategories]);

    useEffect(() => {
        if (responsibleCategoriesFalse?.data) {
            setAssignedCategoriesFalse(responsibleCategoriesFalse.data);
        }
    }, [responsibleCategoriesFalse]);

    useEffect(() => {
        if (responsibleCategoriesTrue?.data) {
            setAssignedCategoriesTrue(responsibleCategoriesTrue.data);
        }
    }, [responsibleCategoriesTrue]);

    useEffect(() => {
        if (fileUsers?.data) {
            setFiles(fileUsers.data);
        }
    }, [responsibleCategoriesTrue]);

    return (
        <div>
            <span className='text-sm text-gray-400'>Mis tareas</span>
            <br />
            <br />
            <TabTasks assignedCategoriesFalse={assignedCategoriesFalse} assignedCategoriesTrue={assignedCategoriesTrue} />
            {(ownLoading || responsibleLoadingFalse || responsibleLoadingTrue || fileUsersLoading) && (
                <p className='text-gray-400'>Cargando...</p>
            )}
            {(ownError || responsibleErrorFalse || responsibleErrorTrue || fileUsersError) && (
                <AlertMessage message={`Ocurrió un error al cargar datos: ${ownError}`} ></ AlertMessage >
            )}
        </div>
    );
};

export default Tasks;
