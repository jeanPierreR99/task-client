import { useEffect, useState } from 'react';
import { API, API_PATH } from '../../../../shared/js/api';
import { useParams } from 'react-router-dom';
import { User } from '../../apps/tasks/store/useStoreTask';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { TabUserView } from './components/TabUserView';

const ViewUser = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState(false)
    
    const getUserId = async () => {
        setLoading(true);
        try {
            const response = await API.getUserId(id!);
            console.log(response)
            if (response?.success) {
                setUser(response.data);
            } else {
                console.error("Error al obtener subtareas");
            }
        } catch (error) {
            console.error("Error en getSubTaskByTask:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getUserId()
    }, [id])

    return (
        <div>
            {user &&
                <div className="flex gap-4 items-center">
                    <Avatar>
                        <AvatarImage src={API_PATH + user.imageUrl} />
                        <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm flex flex-col">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-muted-foreground">{user.email}</span>
                    </p>
                </div>
            }
            {loading && <Loader2 className="animate-spin text-blue-400 m-auto"></Loader2>}
            <br />
            <TabUserView user={user} />
        </div>
    );
};

export default ViewUser;
