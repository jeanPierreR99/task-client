import { ChartBarIncreasing, ClipboardList, Folder, Home, ListTodo, ListTree, Logs, MessageSquareMore, PackagePlus, Tickets, UserRoundPlus } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"
import { NavLink } from "react-router-dom"
import { Separator } from "./ui/separator"
import useStoreLogin from "../state/useStoreLogin"
import { API_PATH } from "../js/api"
import { useLocation } from "react-router-dom"
import { getStorage } from "../js/functions"

interface Project {
  id: string;
  name: string;
  description: string;
}

const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Tareas del Proyecto",
    url: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Mis Tareas",
    url: "/tasks-me",
    icon: ListTree,
  },
  {
    title: "Tareas de Tickets",
    url: "/all-tasks",
    icon: Logs,
  },
  {
    title: "Tickets",
    url: "/all-tickets",
    icon: Tickets,
  },
  {
    title: "Mi Actividad",
    url: "/activity",
    icon: MessageSquareMore,
  },
  {
    title: "Repositorio",
    url: "/repository",
    icon: Folder,
  },
  {
    title: "Mi reporte",
    url: "/report",
    icon: ChartBarIncreasing,
  },
]

const itemsUsers = [
  {
    title: "Registrar",
    url: "/users/register",
    icon: UserRoundPlus,
  },
  {
    title: "Lista",
    url: "/users/list",
    icon: ClipboardList,
  },
  {
    title: "Todas las actividades",
    url: "/users/activities",
    icon: MessageSquareMore,
  },
]

const itemsInventory = [
  {
    title: "Impresoras y escaners",
    url: "/inventory/print-scanners",
    icon: PackagePlus,
  },
]


export function AppSidebar() {
  const { name, email, imageUrl, role, projectId } = useStoreLogin();
  const location = useLocation();

  const getNameProject = () => {
    const projectStorage = getStorage();
    const project = projectStorage.projects.find((project: Project) => project.id === projectId);
    return project ? project.name : 'Proyecto no encontrado';
  }

  return (
    <Sidebar>
      <SidebarContent >
        <div className="w-full text-center max-h-[210px] py-4 px-5 mb-4 flex flex-col items-center">
          {!imageUrl ? <span className="font-black w-20 h-20 text-4xl flex items-center justify-center bg-orange-400 rounded-full">A</span> : <img className="w-30 h-30 rounded-full" src={API_PATH + imageUrl} alt="" />}
          <span className="text-sm font-black">{name}</span>
          <span className="text-sm text-gray-500">{email}</span>
          <span className="text-sm text-blue-500">({getNameProject()})</span>

        </div>
        <Separator></Separator>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive
                        ? "hover:bg-gray-200 font-semibold bg-gray-200"
                        : "hover:bg-gray-200"}
                    >
                      <NavLink to={item.url}>
                        <item.icon />
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {role === 'Administrador' && (
          <SidebarGroup>
            <SidebarGroupLabel>Usuarios y actividades</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemsUsers.map((item) => {
                  const isActive = location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={isActive
                          ? "hover:bg-gray-200 font-semibold bg-gray-200"
                          : "hover:bg-gray-200"}
                      >
                        <NavLink to={item.url}>
                          <item.icon />
                          {item.title}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {role === 'Administrador' && (
          <SidebarGroup>
            <SidebarGroupLabel>Inventario</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemsInventory.map((item) => {
                  const isActive = location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={isActive
                          ? "hover:bg-gray-200 font-semibold bg-gray-200"
                          : "hover:bg-gray-200"}
                      >
                        <NavLink to={item.url}>
                          <item.icon />
                          {item.title}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
