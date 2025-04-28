import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { API } from "../../../../shared/js/api";
import { ToasMessage } from "../../../../components/ToasMessage";
import useStoreLogin from "../../../../shared/state/useStoreLogin";
import { useParams } from "react-router-dom";

const FormFileFolder = ({ setFiles, folderName }: any) => {
    const [file, setFile] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { id: userIdParam } = useParams<{ id: string }>();
    const { id: userIdStore } = useStoreLogin()

    const id = userIdParam ?? userIdStore;


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFile(prev => [...prev, ...selectedFiles]);
        }
    };

    const handleFileUpload = async () => {
        if (file.length === 0) return;

        const formData = new FormData();
        file.forEach((file) => {
            formData.append("files", file);
        });

        setIsUploading(true);

        try {
            const response = await API.uploadFileFoler(id, folderName, formData);
            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Error",
                    description: "No se pudo subir los archivos",
                    type: "error",
                });
                return
            }
            setFiles((prev: any) => [...prev, ...response.data]);

            setFile([]);
            ToasMessage({
                title: "Éxito",
                description: "Archivos subidos correctamente",
                type: "success",
            });
        } catch (error) {
            console.error("Error al subir archivos:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al subir los archivos",
                type: "error",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setFile(file.filter(file => file !== fileToRemove));
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-4">
            <div>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <Button
                    onClick={openFileDialog}
                    className="flex items-center gap-2"
                    variant="outline"
                    disabled={isUploading}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <UploadCloud size={18} />
                            Seleccionar archivos
                        </>
                    )}
                </Button>

                {file.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {file.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between text-sm text-gray-400"
                            >
                                <span className="truncate max-w-[75%]">{file.name}</span>
                                <Button
                                    onClick={() => handleRemoveFile(file)}
                                    size="sm"
                                    variant="ghost"
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                        <Button
                            onClick={handleFileUpload}
                            className="bg-blue-600 hover:bg-blue-700 float-right"
                            size="sm"
                            disabled={isUploading}
                        >
                            Subir todos
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormFileFolder;
