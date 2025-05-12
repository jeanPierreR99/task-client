import { useEffect, useState } from 'react';
import { API } from '../../../../../shared/js/api';
import useStoreLogin from '../../../../../shared/state/useStoreLogin';
import { Folder } from '../Repository';
import { Folder as FolderIcon } from 'lucide-react';
import ViewFolderFiles from './ViewFolderFiles';
import { useParams } from 'react-router-dom';

const FolderList = ({ setDataFile, fileData }: any) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<Folder>();

    const { id: userIdParam } = useParams<{ id: string }>();
    const { projectId } = useStoreLogin()

    const id = userIdParam ?? projectId;
    useEffect(() => {
        const fetchFolders = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await API.getFolderByUser(id);
                setDataFile(response.data);
            } catch (err: any) {
                setError('Ocurrió un error al cargar las carpetas.' + err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFolders();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    const handleFolderSelect = (folder: Folder) => {
        setSelectedFolder(folder);
        setOpen(true);
    };

    return (
        <div>
            {fileData.length === 0 ? (
                <p className='text-gray-400 text-sm'>No hay carpetas disponibles.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {fileData.map((folder: Folder, index: number) => (
                        <button
                            onClick={() => handleFolderSelect(folder)}
                            key={index}
                            className="border text-left p-4 rounded-lg shadow hover:shadow-md transition duration-200 cursor-pointer bg-orange-50 border-orange-200"
                        >
                            <div className="flex flex-col gap-2 mb-2">
                                <div className='flex items-center gap-2'>
                                    <FolderIcon className="text-yellow-500" size={35} />
                                    <h3 className="font-semibold truncate">{folder.folder}</h3>
                                </div>
                                {folder.totalFiles > 0 ? <span className="text-orange-400 italic text-sm">{folder.totalFiles} archivos</span> : <span className="text-orange-400 italic text-sm">Sin archivos</span>}
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {selectedFolder && (
                <ViewFolderFiles
                    open={open}
                    setOpen={setOpen}
                    selectedFolder={selectedFolder}
                />
            )}
        </div>
    );
};

export default FolderList;
