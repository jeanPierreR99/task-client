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
import useStoreNotification from "../state/useStoreNotification";

export default function Layout() {
    const { name, email, imageUrl } = useStoreLogin();
    const { setMessage } = useStoreNotification()
    const { id } = useStoreLogin()

    useEffect(() => {
        const socket = io(API_PATH);
        socket.emit('joinTaskAsigned', id);

        socket.on('updateTaskAsigned', (data) => {

            if (data.userId !== id) return;
            ToasMessage({
                title: "Tienes una nueva tarea asginada",
                description: `Se te asignó la tarea ${data.task.name} por: ${data.task.created_by.name}`,
                type: "success",
                duration: 7000
            });
            setMessage("Se te asignaron nuevas tareas, actualiza la página")
        })

        return () => {
            socket.disconnect()
        }
    }, [])

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