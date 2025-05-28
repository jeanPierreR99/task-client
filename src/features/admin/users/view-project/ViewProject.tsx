import { useEffect, useState } from 'react';
import { API } from '../../../../shared/js/api';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { TabProjectView } from './components/TabProjectView';

interface Project {
    name: string;
    description: string;
}

const ViewProject = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(false);

    const fetchProject = async () => {
        setLoading(true);
        try {
            const response = await API.getProjectOne(id!, 0, 0);
            console.log(response);
            if (response?.success && response.data) {
                setProject(response.data);
            } else {
                console.error("Error al obtener proyecto");
            }
        } catch (error) {
            console.error("Error al obtener proyecto:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    return (
        <div>
            {loading && <Loader2 className="animate-spin text-blue-400 m-auto" />}
            {project && (
                <div className="flex gap-4 items-center mt-2">
                    <p className="text-sm flex flex-col">
                        <span className="font-semibold">{project.name}</span>
                        <span className="text-muted-foreground">{project.description}</span>
                    </p>
                </div>
            )}
            <br />
            <TabProjectView />
        </div>
    );
};

export default ViewProject;
