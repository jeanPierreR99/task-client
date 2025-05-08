import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../shared/components/ui/select"
import { API } from "../../../../../shared/js/api"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import { ToasMessage } from "../../../../../components/ToasMessage"

type Project = {
    id: string
    name: string
}

export default function ProjectSelect({ idTask }: any) {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const { id } = useStoreLogin();

    const getProjects = async () => {
        setLoading(true)
        try {
            const response = await API.getProjects()

            if (!response?.data || !response?.success) { return }

            setProjects(response.data)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getProjects();
    }, [])

    const changeProject = async () => {
        const payload = {
            projectId: selectedProjectId
        }
        try {
            const response = await API.UpdateTask(idTask, id, payload);

            if (!response.success && !response.data) {
                ToasMessage({
                    title: "Advertencia",
                    description: "No se pudo cambiar de proyecto",
                    type: "warning",
                });
                return
            }
            console.log(response)
            ToasMessage({
                title: "Proyecto cambiado",
                description: "La tarea tiene un nuevo proyecto",
                type: "success",
            });
            return

        } catch (error) {
            console.log(error)
            ToasMessage({
                title: "Error",
                description: "Ocurrio u nerror al cambiar de proyecto" + error,
                type: "error",
            });
            return

        }
    }
    useEffect(() => {
        if (selectedProjectId) {
            changeProject();
        }
    }, [selectedProjectId])

    if (loading) {
        return <span>Cargando ...</span>
    }

    return (
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent>
                {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
