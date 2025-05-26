import { useEffect, useState } from 'react';
import { Card } from '../../../../../shared/components/ui/card';
import ChartBarComplete from './Chart-bar-complete';
import ChartBarPending from './Chart-bar-pending';
import { API } from '../../../../../shared/js/api';
import { Loader2 } from 'lucide-react';

interface Itotal {
    taskCompleted: number;
    taskPending: number;
    ticketCompleted: number;
    ticketPending: number;
}

interface Idata {
    date: string;
    task: number;
    ticket: number
}

const DashBoard = ({ userId }: any) => {
    const [dataTotal, setDataTotal] = useState<Itotal | null>(null)
    const [dataCompleted, setDataCompleted] = useState<Idata[]>([])
    const [dataPending, setDataPending] = useState<Idata[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const getDataTotal = async () => {
        try {
            const response = await API.getTotalsDashboard(userId)
            if (response?.success) {
                setDataTotal(response.data);
            } else {
                console.error("Error al obtener totales del dashboard");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getDataCompleted = async () => {
        try {
            const response = await API.getCompleteDashboard(userId)
            if (response?.success) {
                setDataCompleted(response.data);
            } else {
                console.error("Error al obtener totales del dashboard");
            }
        } catch (error) {
            console.log(error)
        }
    }


    const getDataPending = async () => {
        try {
            const response = await API.getPendingDashboard(userId)
            if (response?.success) {
                setDataPending(response.data);
            } else {
                console.error("Error al obtener totales del dashboard");
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userId) return;

        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    getDataTotal(),
                    getDataCompleted(),
                    getDataPending(),
                ]);
            } catch (error) {
                console.error("Error al cargar datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);



    return (
        <div>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-4'>
                <Card className="p-4 shadow-lg border-none bg-cyan-400 black hover:scale-95 duration-300">
                    <p className="text-sm">Tareas completadas</p>
                    {loading && <Loader2 className='animate-spin text-black' />}
                    <h3 className="text-2xl font-bold">{dataTotal?.taskCompleted}</h3>
                </Card>
                <Card className="p-4  shadow-lg border-none bg-red-400 text-white hover:scale-95 duration-300">
                    <p className="text-sm">Tareas pendientes</p>
                    {loading && <Loader2 className='animate-spin text-white' />}
                    <h3 className="text-2xl font-bold">{dataTotal?.taskPending}</h3>
                </Card>
                <Card className="p-4  shadow-lg border-none bg-blue-400 text-white hover:scale-95 duration-300">
                    <p className="text-sm">Tickets completados</p>
                    {loading && <Loader2 className='animate-spin text-whie' />}
                    <h3 className="text-2xl font-bold">{dataTotal?.ticketCompleted}</h3>
                </Card>
                <Card className="p-4  shadow-lg border-none bg-yellow-300 text-black hover:scale-95 duration-300">
                    <p className="text-sm">Tickets pendientes</p>
                    {loading && <Loader2 className='animate-spin text-black' />}
                    <h3 className="text-2xl font-bold">{dataTotal?.ticketPending}</h3>
                </Card>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <ChartBarComplete data={dataCompleted} />
                <ChartBarPending data={dataPending} />
            </div>
        </div>
    );
};

export default DashBoard;