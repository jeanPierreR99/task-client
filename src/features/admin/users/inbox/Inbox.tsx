import { useEffect, useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { API, API_PATH } from '../../../../shared/js/api';
import { FileText, Loader2, Search } from 'lucide-react';
import { io } from 'socket.io-client';
import { Input } from '../../../../shared/components/ui/input';

export interface File {
    id: string;
    name: string;
    reference: string;
    inFolder: boolean;
    nameFolder: string | null;
    uploaded_in: string;
    url: string;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    status: string;
    dateCulmined: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    imageUrl: string;
    roleId: string;
    active: boolean;
}

interface Comment {
    id: string;
    comment: string;
    date: string;
}

export interface Activity {
    id: string;
    action: string;
    create_at: string;
    user: User;
    task: Task;
    subtask: any | null;
    files: File[];
    comment: Comment;
}

const Inbox = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loader = useRef<HTMLDivElement>(null);
    const limit = 20;

    const getAllActivities = async (offsetValue: number = 0) => {
        setLoading(true);
        try {
            const response = await API.getAllActivities(limit, offsetValue);

            if (!response.data || !response.success) return;
            if (offsetValue === 0) {
                setActivities(response.data);
            } else {
                setActivities((prev) => [...prev, ...response.data]);
            }

            if (response.data.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            console.log("error al obtener las actividades: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllActivities(0);

        const socket = io(API_PATH);
        socket.on('updateActivity', (data) => {
            setActivities((prev) => [data.data, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setOffset(prev => prev + limit);
            }
        }, { threshold: 1 });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (offset === 0) return;
        getAllActivities(offset);
    }, [offset]);

    const filteredActivities = activities.filter((activity) =>
        activity.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <span className="text-sm text-gray-400">Historial de actividades</span>
            <br />
            <br />
            <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <Input
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4"
                />
            </div>
            <br />
            {loading && activities.length === 0 && (
                <Loader2 className="animate-spin text-blue-400 m-auto" />
            )}

            <div className="flex flex-col">
                {filteredActivities.map((activity) => (
                    <div key={activity.id} className="hover:bg-gray-50 transition-all border-b p-2">
                        <div className="flex gap-4 items-center">
                            <Avatar>
                                <AvatarImage src={API_PATH + activity.user.imageUrl} />
                                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                                <span className="font-semibold">{activity.user.name}</span>{' '}
                                {activity.action}
                                {activity.task && (
                                    <><span className="font-medium"> - {activity.task.name}</span></>
                                )}
                            </p>
                        </div>
                        <p className="pl-12 text-sm text-gray-500">{activity.comment?.comment}</p>
                        <div className="w-full pl-12 flex flex-col gap-2">
                            {activity.files?.length > 0 && activity.files.map((file) => {
                                const url = API_PATH + file.url;
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url);
                                const isVideo = /\.(mp4|webm|ogg)$/i.test(file.url);

                                return isImage ? (
                                    <a key={file.id} href={url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            className="w-[300px] aspect-square max-h-[300px]"
                                            src={url}
                                            alt={`Imagen adjunta ${file.name}`}
                                        />
                                    </a>
                                ) : isVideo ?
                                    <video
                                        key={file.id}
                                        controls
                                        className="w-[300px] max-h-[300px] hover:shadow"
                                    >
                                        <source src={url} type="video/mp4" />
                                        Tu navegador no soporta la etiqueta de video.
                                    </video> :
                                    <a
                                        key={file.id}
                                        href={API_PATH + file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 min-w-[300px] text-sm underline flex hover:shadow gap-2 items-center bg-orange-50 border-orange-200 border p-2 w-fit rounded-md"
                                    >
                                        <FileText size={40} className="bg-orange-100 p-2 rounded-md" /> {file.name}
                                    </a>

                            })}
                        </div>
                        <p className="text-xs text-muted-foreground float-end mb-2">
                            {formatDistanceToNow(new Date(activity.create_at), {
                                addSuffix: true,
                                locale: es,
                            })}
                        </p>
                    </div>
                ))}

                {loading && activities.length > 0 && (
                    <Loader2 className="animate-spin text-orange-400 m-auto mt-4" />
                )}

                {!hasMore && !loading && (
                    <p className="text-center text-gray-400 my-4 text-sm">No hay más actividades para mostrar.</p>
                )}

                <div ref={loader} className="h-1" />
            </div>
        </div>
    );
};

export default Inbox;
