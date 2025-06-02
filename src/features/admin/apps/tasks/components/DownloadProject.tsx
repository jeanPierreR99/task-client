import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogDescription,
} from "../../../../../shared/components/ui/alert-dialog";
import { Button } from "../../../../../shared/components/ui/button";
import { DownloadCloud } from "lucide-react";
import { TooltipWrapper } from "../../../../../components/TooltipWrapper";
import { useState } from "react";
import { Calendar } from "../../../../../shared/components/ui/calendar"; // asegúrate de importar correctamente
import { es } from "date-fns/locale";
import { API_BASE } from "../../../../../shared/js/api";

const today = new Date();

const DownloadProject = ({ id }: any) => {
    const [fromDate, setFromDate] = useState<Date | undefined>(today);
    const [toDate, setToDate] = useState<Date | undefined>(today);

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <TooltipWrapper content="Reporte del proyecto">
                    <Button className="w-[80px] h-[80px] hover:bg-blue-400 bg-blue-500 text-white duration-300 ease-out rounded-full relative">
                        <DownloadCloud
                            className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />

                    </Button>
                </TooltipWrapper>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Descargar reporte de tareas de este proyecto</AlertDialogTitle>
                    <AlertDialogDescription>
                        Seleccione una fecha de inicio y una fecha final
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium mb-2">Fecha de inicio</p>
                        <Calendar
                            locale={es}
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            initialFocus
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2">Fecha final</p>
                        <Calendar
                            locale={es}
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button
                        disabled={!fromDate || !toDate}
                        className="bg-blue-500 hover:bg-blue-400"
                        onClick={() => {
                            if (fromDate && toDate) {
                                const from = encodeURIComponent(fromDate.toISOString());
                                const to = encodeURIComponent(toDate.toISOString());
                                const url = `${API_BASE}/report/project-excel/${id}?start=${from}&end=${to}`;
                                window.open(url, "_blank");
                            }
                        }}
                    >
                        Descargar
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DownloadProject;
