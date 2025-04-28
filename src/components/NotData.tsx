import { FolderKanban } from 'lucide-react';

const NoData = ({ title }: any) => {
    return (
        <div className='flex flex-col mt-10 gap-4 text-gray-400 items-center justify-center'>
            <FolderKanban size={40}></FolderKanban>
            <span className='text-sm text-center'>{title}</span>
        </div>
    );
};

export default NoData;