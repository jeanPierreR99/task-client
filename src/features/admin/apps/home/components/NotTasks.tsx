import { CheckCircle } from 'lucide-react';


const NotTasks = () => (
    <div className='flex flex-col mt-10 md:w-[400px] m-auto gap-4 text-gray-400 items-center justify-center'>
        <CheckCircle size={40}></CheckCircle>
        <span className='text-sm text-center'>No tiene tareas</span>
    </div>
);

export default NotTasks;