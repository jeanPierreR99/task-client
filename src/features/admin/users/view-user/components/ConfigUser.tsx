import { useEffect, useState } from "react";
import { Button } from "../../../../../shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../shared/components/ui/card";
import { Label } from "../../../../../shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../shared/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../../../shared/components/ui/sheet";
import { Switch } from "../../../../../shared/components/ui/switch";
import { API } from "../../../../../shared/js/api";
import { ToasMessage } from "../../../../../components/ToasMessage";
import { useParams } from "react-router-dom";

interface Role {
    id: string;
    name: string;
}

interface Project {
    id: string;
    name: string;
}

const ConfigUser = ({ open, setOpen, user }: { open: boolean, setOpen: (open: boolean) => void, user: any }) => {
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [isDeactivated, setIsDeactivated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await API.getRole();
                setRoles(response.data);
            } catch (error) {
                console.error("Error al cargar los roles:", error);
                ToasMessage({
                    title: "Error",
                    description: "No se pudieron cargar los roles",
                    type: "error",
                });
            }
        };

        const fetchProjects = async () => {
            try {
                const res = await API.getProjects();
                setProjects(res.data);
            } catch (error) {
                console.error("Error al cargar proyectos:", error);
                ToasMessage({
                    title: "Error",
                    description: "No se pudieron cargar los proyectos",
                    type: "error",
                });
            }
        };

        fetchRoles();
        fetchProjects();
    }, []);

    const handleUpdateRole = async () => {
        try {
            setLoading(true);
            const response = await API.changeUserRole(id!, selectedRole);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar el rol",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Rol actualizado",
                description: "El rol del usuario fue actualizado correctamente",
                type: "success",
            });
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al actualizar el rol",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            setLoading(true);
            const response = await API.changeUserActiveStatus(id!, isDeactivated);
            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar el estado de la cuenta",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Estado actualizado",
                description: isDeactivated ? "Cuenta activada" : "Cuenta desactivada",
                type: "success",
            });
            setOpen(false);
            setIsDeactivated(prev => !prev);
        } catch (error) {
            console.error("Error al cambiar estado de cuenta:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al cambiar el estado de la cuenta",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProjects = async () => {
        try {
            setLoading(true);
            console.log(selectedProjects)
            const response = await API.updateUserProjects(id!, selectedProjects);
            console.log(response)
            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudieron actualizar los proyectos",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Proyectos actualizados",
                description: "Asignación de proyectos guardada correctamente",
                type: "success",
            });
            setOpen(false);
        } catch (error) {
            console.error("Error al actualizar proyectos:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al actualizar los proyectos",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user) {
            setIsDeactivated(!user.active);
            setSelectedProjects(user.projects?.map((p: any) => p.id) || []);
        }
    }, [user]);


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Configuración de Usuario</SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-8 px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cambiar Rol</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Seleccionar nuevo rol</Label>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                disabled={!selectedRole || loading}
                                className="w-full bg-blue-700 hover:bg-blue-800"
                                onClick={handleUpdateRole}
                            >
                                {loading ? "Actualizando..." : "Actualizar Rol"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{isDeactivated ? "Cuenta Desactivada" : "Cuenta Activa"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="deactivate-switch">
                                    {isDeactivated ? "Activar cuenta" : "Desactivar cuenta"}
                                </Label>
                                <Switch
                                    id="deactivate-switch"
                                    checked={!isDeactivated}
                                    onCheckedChange={handleToggleStatus}
                                />

                            </div>
                            <Button
                                variant={isDeactivated ? "default" : "destructive"}
                                className="w-full"
                                onClick={handleToggleStatus}
                                disabled={loading}
                            >
                                {loading
                                    ? (isDeactivated ? "Activando..." : "Desactivando...")
                                    : (isDeactivated ? "Activar Cuenta" : "Desactivar Cuenta")}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Asignar/Desasignar Proyectos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Asignar a Proyectos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {projects.map((project) => {
                                const isSelected = selectedProjects.includes(project.id);

                                const toggleProject = () => {
                                    if (isSelected) {
                                        setSelectedProjects(prev =>
                                            prev.filter(id => id !== project.id)
                                        );
                                    } else {
                                        setSelectedProjects(prev => [...prev, project.id]);
                                    }
                                };

                                return (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between"
                                    >
                                        <Label htmlFor={`project-${project.id}`}>{project.name}</Label>
                                        <Switch
                                            id={`project-${project.id}`}
                                            checked={isSelected}
                                            onCheckedChange={toggleProject}
                                        />
                                    </div>
                                );
                            })}

                            <Button
                                disabled={loading}
                                onClick={handleUpdateProjects}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </CardContent>
                    </Card>


                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ConfigUser;
