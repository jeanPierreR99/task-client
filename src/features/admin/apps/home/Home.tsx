import { CheckCheck, FolderOpen, UserPenIcon } from 'lucide-react';
import { dateFormated } from '../../../../lib/date';
import { TabTasks } from './components/TabTasks';
import NotProjects from './components/NotProjects';
import NotColaboration from './components/NotColaboration';
import { useEffect, useState } from 'react';
import { User } from '../tasks/store/useStoreTask';
import { API, API_PATH } from '../../../../shared/js/api';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import useStoreLogin from '../../../../shared/state/useStoreLogin';
import { getStorage, saveStorage } from '../../../../shared/js/functions';

interface Project {
    id: string;
    name: string;
    description: string;
}

const Home = () => {
    const [users, setUsers] = useState<User[]>([])
    const { name, projectId, } = useStoreLogin();
    const [counTask, setCountTask] = useState("");
    const [project, setProject] = useState<Project[] | null>(null);

    const getUser = async () => {
        const response = await API.getUser(projectId)
        setUsers(response.data)
    }
    const getTaskFalse = async () => {
        const response = await API.getTaskAllFalse(projectId)
        setCountTask(response.data)
    }

    function handleChangeActiveProject(id: string) {
        const userStorage = getStorage();
        userStorage.projectId = id

        saveStorage(userStorage)
        window.location.reload();
    }

    const getNameProject = () => {
        const projectStorage = getStorage();
        const project = projectStorage.projects.find((project: Project) => project.id === projectId);
        return project ? project.name : 'Proyecto no encontrado';
    }

    useEffect(() => {
        const projectStorage = getStorage()
        setProject(projectStorage.projects)
        getUser();
        getTaskFalse();
    }, [])
    return (
        <div className='pt-10'>
            <div className='flex flex-col gap-2 items-center'>
                <span className="text-md font-light text-center">{dateFormated().toLocaleUpperCase()}</span>
                <span className="text-3xl text-center">Hola, {name}</span>
                <span className="text-3xl text-blue-500 text-center">Ahora estas en el proyecto ({getNameProject()})</span>
                <div className='flex gap-3 md:gap-12 text-gray-400 text-sm bg-gray-100 py-2 px-4 rounded-full'>
                    <div className='flex gap-2 items-center'><CheckCheck></CheckCheck><span className='text-2xl'>{counTask && counTask.length}</span>Tareas pendientes</div>
                    <div className='flex gap-2 items-center'><UserPenIcon></UserPenIcon><span className='text-2xl'>{users && users.length}</span>Colaboradores</div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                <div className='md:col-span-2 h-[400px] overflow-y-auto w-full shadow-lg rounded-md p-4'>
                    <TabTasks></TabTasks>
                </div>
                <div className='shadow-lg h-[400px] rounded-md p-4'>
                    <span className='text-xl font-bold'>Proyectos</span>
                    {project ? project.map((project: Project) => {
                        const isActive = project.id === projectId;
                        return (
                            <div
                                key={project.id}
                                onClick={() => handleChangeActiveProject(project.id)}
                                className={`border-b mt-2 cursor-pointer p-2 duration-300 ease-linear hover:bg-gray-50 
                    ${isActive ? ' text-blue-500' : ''}`}
                            >
                                <span className='font-medium flex gap-2'>{isActive ? <FolderOpen></FolderOpen> : ""}{project.name}</span>
                                <p className='text-sm text-gray-500'>{project.description}</p>
                            </div>
                        );
                    }) : <NotProjects />}
                </div>

                <div className='shadow-lg h-[400px] overflow-y-auto rounded-md p-4'>
                    <span className='text-xl font-bold'>Colaboradores</span>
                    <div className='mt-2 flex flex-col gap-2'>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user: User) => (
                                <div key={user.id} className='p-2 border-b flex gap-4 items-center hover:bg-gray-50 duration-300 ease-linear'>
                                    <Avatar>
                                        <AvatarImage src={API_PATH + user.imageUrl} />
                                        <AvatarFallback>{user.name}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <span className='font-medium'>{user.name}</span>
                                        {user.email && <p className='text-sm text-gray-500'>{user.email}</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <NotColaboration />
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home;