import { useState } from 'react';
import RegisterFolder from './components/RegisterFolder';
import FolderList from './components/FolderList';

export interface FileItem {
    id: string;
    inFolder: boolean;
    name: string;
    nameFolder: string;
    reference: string;
    uploaded_in: string
    url: string;
};

export interface Folder {
    folder: string;
    totalFiles: number;
};


const Repository = () => {
    const [fileData, setDataFile] = useState<Folder[]>([])

    return (
        <div>
            <span className='text-sm text-gray-400'>Repositorio del Proyecto</span>
            <br />
            <br />
            <RegisterFolder setDataFile={setDataFile} />
            <FolderList setDataFile={setDataFile} fileData={fileData} />
        </div>
    );
};

export default Repository;