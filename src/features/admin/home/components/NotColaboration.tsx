import { UserSearch } from 'lucide-react';

const NotColaboration = () => {
    return (
        <div className='flex flex-col mt-10 gap-4 text-gray-400 items-center justify-center'>
            <UserSearch size={40}></UserSearch>
            <span className='text-sm text-center'>No hay colaboradores</span>
        </div>
    );
};

export default NotColaboration;