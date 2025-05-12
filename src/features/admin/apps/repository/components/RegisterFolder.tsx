import React, { useState } from 'react';
import useStoreLogin from '../../../../../shared/state/useStoreLogin';
import { API } from '../../../../../shared/js/api';
import { ToasMessage } from '../../../../../components/ToasMessage';
import { Button } from '../../../../../shared/components/ui/button';
import { Input } from '../../../../../shared/components/ui/input';
import { useParams } from 'react-router-dom';

const RegisterFolder = ({ setDataFile }: any) => {
    const [folderName, setFolderName] = useState('');
    const [loading, setLoading] = useState(false);

    const { id: projectIdParam } = useParams<{ id: string }>();
    const { projectId } = useStoreLogin()

    const id = projectIdParam ? projectIdParam : projectId


    const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleFolder = async () => {
        if (!folderName.trim()) {
            ToasMessage({
                title: "Alerta",
                description: "La carpeta debe contener un nombre.",
                type: "warning",
            });
            return
        }

        try {
            setLoading(true);
            const response = await API.createFolderByUser(id, { folderName: folderName })

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Alerta",
                    description: "No se pudo crear la carpeta.",
                    type: "warning",
                });
                return;
            }
            setDataFile((prev: any) => [...prev, response.data])
            setFolderName("")
            ToasMessage({
                title: "Carpeta registrada",
                description: "La carpeta ha sido creada exitosamente en su repositorio.",
                type: "success",
            });
        } catch (error: any) {
            console.error("Error al registrar la carpeta:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al registrar el rol.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <Input
                    id="folderName"
                    type="text"
                    value={folderName}
                    onChange={handleFolderNameChange}
                    placeholder="Ingrese el nombre de la carpeta"
                    required
                    className='w-fit'
                />
                <Button
                    onClick={handleFolder}
                    className="px-4 w-fit py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-md"
                    disabled={loading}
                >
                    {loading ? 'Creando...' : 'Crear Carpeta'}
                </Button>
            </div>
        </div >
    );
};

export default RegisterFolder;
