import { AppSidebar } from "../components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronsLeftRight, User2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";
import { deleteStorage } from "../js/functions";
import useStoreLogin from "../state/useStoreLogin";
import { API_PATH } from "../js/api";
import { useEffect } from "react";
import { ToasMessage } from "../../components/ToasMessage";
import { io } from "socket.io-client";
import useStoreTask from "../../features/admin/apps/tasks/store/useStoreTask";

export default function Layout() {
    const { name, email, imageUrl, projectId } = useStoreLogin();
    const { addTaskToCategory, setCategories, removeCategory, moveTaskToCategory, updateTaskById, removeTaskFromCategory } = useStoreTask();

    useEffect(() => {
        if (!projectId) return;

        const socket = io(API_PATH, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        socket.emit('joinTaskProject', projectId);

        socket.on('updateTaskProject', (data) => {
            if (data.projectId !== projectId) return;
            ToasMessage({
                title: "Se agrego una nueva tarea al proyecto",
                description: `Se agrego la tarea ${data.task.name} por: ${data.task.created_by.name}`,
                type: "success",
                duration: 7000
            });
            addTaskToCategory(data.task.category.id, data.task);
        })

        socket.on('updateCategoryProject', (data) => {
            if (data.projectId !== projectId) return;
            console.log(data)
            ToasMessage({
                title: "Se agrego una nueva categoría al proyecto",
                description: `Categoría: ${data.category.title}`,
                type: "success",
                duration: 7000
            });
            setCategories((prev) => [...prev, data.category]);
        });

        socket.on('deleteCategoryProject', (data) => {
            if (data.projectId !== projectId) return;
            ToasMessage({
                title: "Se elimino una categoria del proyecto",
                description: `Se elimino la categoria ${data.category.title}`,
                type: "success",
            });
            removeCategory(data.category.id);
        });

        socket.on('updateCategoryTaskProject', (data) => {
            if (data.projectId !== projectId) return;
            ToasMessage({
                title: "Se actualizó de categoría una tarea",
                description: `La tarea ${data.task.name} se cambió de categoría a ${data.task.category.title}`,
                type: "success",
            });
            moveTaskToCategory(data.task.id, data.task.category.id);
        });

        socket.on('deleteTaskProject', (data) => {
            if (data.projectId !== projectId) return;
            ToasMessage({
                title: "Se elimino una tarea del proyecto",
                description: `Se eliminó la tarea ${data.task.name} por ${data.task.responsible.name}`,
                type: "success",
            });
            removeTaskFromCategory(data.task.category.id, data.task.id);
        });

        socket.on('updateTaskStatusProject', (data) => {
            if (data.projectId !== projectId) return;
            ToasMessage({
                title: "Se actualizó una tarea del proyecto",
                description: `Se marcó como ${data.task.status} la tarea ${data.task.name}`,
                type: "success",
            });
            updateTaskById(data.task.id, data.task);
        });

        socket.on('updateTaskDateProject', (data) => {
            console.log(data)
            if (data.projectId !== projectId) return;
            ToasMessage({
                title: "Se actualizó una tarea del proyecto",
                description: `Se cambio la fecha de entrega de la tarea ${data.task.name}`,
                type: "success",
            });
            const dataAux: any = {
                dateCulmined: data.task.dateCulmined
            }
            updateTaskById(data.task.id, dataAux);
        });

        return () => {
            socket.disconnect()
        }
    }, [projectId])

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="w-full border-b h-12 flex items-center justify-between ">
                    <SidebarTrigger />
                    <div className="float-right pr-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center cursor-pointer">
                                    {!imageUrl ? <span className="font-black w-10 h-10 flex items-center justify-center bg-orange-400 rounded-full">A</span>
                                        : <img className="w-10 h-10 rounded-full" src={API_PATH + imageUrl} alt="" />
                                    }
                                    <ChevronDown size={18}></ChevronDown>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 text-center">
                                <div className="flex flex-col justify-center items-center">{!imageUrl ? <span className="font-black w-14 h-14 flex items-center justify-center bg-orange-400 rounded-full">JR</span> : <img className="w-14 h-14 rounded-full" src={API_PATH + imageUrl} alt="" />}
                                    <span className="text-sm font-black">{name}</span>
                                    <span className="text-sm text-gray-500">{email}</span>
                                </div>

                                <DropdownMenuSeparator />
                                <Button variant={"ghost"} style={{ fontWeight: 400 }} className="w-full flex justify-start text-gray-700">
                                    <User2 />  Perfil
                                </Button>
                                <Button variant={"ghost"} style={{ fontWeight: 400 }} className="w-full overflow-hidden flex p-0 justify-start text-gray-700 ">
                                    <NavLink to="config" className="flex gap-1 w-full p-2 pl-3"><ChevronsLeftRight></ChevronsLeftRight>  Configuración</NavLink>
                                </Button>
                                <Button onClick={() => deleteStorage()} variant={"ghost"} style={{ fontWeight: 400 }} className="w-full flex justify-start text-gray-700">
                                    <ArrowLeft></ArrowLeft> Cerrar sesión
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu >
                    </div>
                </div>
                <div className="px-5 py-5">
                    <Outlet />
                </div>
            </main>
            <Toaster></Toaster>
        </SidebarProvider >
    )
}