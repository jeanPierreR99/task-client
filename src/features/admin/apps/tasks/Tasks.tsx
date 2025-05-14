import { useEffect } from 'react';
import { TabTasks } from './components/TabTasks';
import { API } from '../../../../shared/js/api';
import useStoreLogin from '../../../../shared/state/useStoreLogin';
import useApiFetch from '../../../../hooks/useApiFetch';
import useStoreTask from './store/useStoreTask';
import useStoreFile from './store/useStoreFile';
import { AlertMessage } from '../../../../components/AlertMessage';
import { getStorage } from '../../../../shared/js/functions';
import { useParams } from 'react-router-dom';

const Tasks = () => {
    const { setFiles } = useStoreFile()
    const { id: projectIdParam } = useParams<{ id: string }>();

    const { id } = useStoreLogin();
    const { setCategories } = useStoreTask();

    const projectId = getStorage();

    const projectIdValue = projectIdParam ? projectIdParam : projectId.projectId;

    const {
        data: ownCategories,
        error: ownError,
        isLoading: ownLoading
    } = useApiFetch(
        ["projectsOne", projectIdValue],
        () => API.getProjectOne(projectIdValue)
    );


    const {
        data: fileUsers,
        error: fileUsersError,
        isLoading: fileUsersLoading
    } = useApiFetch(
        ["file_user_f", id],
        () => API.getFilesByUserId(id)
    );

    useEffect(() => {
        if (ownCategories?.data) {
            setCategories(ownCategories.data.categories);
        }
    }, [ownCategories]);


    useEffect(() => {
        if (fileUsers?.data) {
            setFiles(fileUsers.data);
        }
    }, [fileUsers]);

    return (
        <div>
            <span className='text-sm text-gray-400'>Mis tareas</span>
            <br />
            <br />
            <TabTasks />
            {
                (ownLoading || fileUsersLoading) && (
                    <p className='text-gray-400'>Cargando...</p>
                )
            }
            {
                (ownError || fileUsersError) && (
                    <AlertMessage message={`Ocurrió un error al cargar datos: ${ownError}`} ></ AlertMessage >
                )
            }
        </div >
    );
};

export default Tasks;
