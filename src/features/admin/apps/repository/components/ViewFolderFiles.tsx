import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "../../../../../shared/components/ui/dialog";
import { FileItem, Folder as FolderType } from "../Repository";
import { ChevronRight, FolderIcon, FileText, CalendarDays, Download } from "lucide-react";
import { API, API_PATH } from "../../../../../shared/js/api";
import useStoreLogin from "../../../../../shared/state/useStoreLogin";
import { format } from "date-fns";
import FormFileFolder from "./FormFileFolder";
import NoData from "../../../../../components/NotData";

interface ViewFolderFilesProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedFolder: FolderType;
}

const ViewFolderFiles: React.FC<ViewFolderFilesProps> = ({ open, setOpen, selectedFolder }) => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);

    const { projectId } = useStoreLogin()


    useEffect(() => {
        if (!open || !selectedFolder) return;

        const fetchFiles = async () => {
            setLoading(true);
            try {
                const response = await API.getFolderContent(projectId, selectedFolder.folder);
                setFiles(response.data);
            } catch (err) {
                console.error("Error fetching files", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [open]);


    if (!selectedFolder) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-6xl h-[80vh] md:h-[90vh] overflow-hidden p-0 flex gap-0 flex-col">
                <DialogHeader className="p-6 border-b font-bold flex flex-row" />

                <div className="flex gap-2 items-center mt-4 font-bold px-4">
                    <FolderIcon className="text-yellow-500" />
                    <span className="flex items-center font-bold">{selectedFolder.folder} <ChevronRight size={20} className="ml-2" /></span>
                </div>

                <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                    <FormFileFolder setFiles={setFiles} folderName={selectedFolder.folder} />
                    {loading ? (
                        <p className="italic text-gray-400 px-4 py-2">Cargando archivos...</p>
                    ) : files.length === 0 ? (
                        <NoData title="Esta carpeta no contiene archivos." />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file, key) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-4 p-4 rounded-md border bg-orange-50 border-orange-200 hover:shadow transition-shadow"
                                >
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-md">
                                        <FileText size={28} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-gray-800 font-medium break-words text-sm">{file.name}</p>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <CalendarDays size={14} />
                                            {format(new Date(file.uploaded_in), "dd MMM yyyy, HH:mm")}
                                        </div>
                                    </div>
                                    <a href={API_PATH + file.url} target="__blank" className="p-1 rounded hover:bg-orange-100">
                                        <Download size={20} className="text-orange-500" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewFolderFiles;
