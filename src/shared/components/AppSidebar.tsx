import { ClipboardList, Folder, Home, ListTodo, Logs, MessageSquareMore, PackagePlus, Tickets, UserRoundPlus } from "lucide-react"

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

const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Tareas",
    url: "/tasks",
    icon: ListTodo,
  },
  // {
  //   title: "Proyectos",
  //   url: "/projects",
  //   icon: LucideGroup,
  // },
  {
    title: "Lista de Tareas",
    url: "/all-tasks",
    icon: Logs,
  },
  {
    title: "Lista de Tickets",
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
  // {
  //   title: "Lista",
  //   url: "/users/list",
  //   icon: DatabaseBackupIcon,
  // },
  // {
  //   title: "Categorias",
  //   url: "/users/activities",
  //   icon: Tag,
  // },
]

export function AppSidebar() {
  const { name, email, imageUrl, role } = useStoreLogin();

  return (
    <Sidebar>
      <SidebarContent >
        <div className="w-full text-center h-[180px] py-4 px-5 mb-4 flex flex-col items-center">
          {!imageUrl ? <span className="font-black w-20 h-20 text-4xl flex items-center justify-center bg-orange-400 rounded-full">A</span> : <img className="w-30 h-30 rounded-full" src={API_PATH + imageUrl} alt="" />}
          <span className="text-sm font-black">{name}</span>
          <span className="text-sm text-gray-500">{email}</span>
        </div>
        <Separator></Separator>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      <item.icon />
                      {item.title}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {role === 'Administrador' && (
          <SidebarGroup>
            <SidebarGroupLabel>Usuarios y actividades</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemsUsers.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon />
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {role === 'Administrador' && (
          <SidebarGroup>
            <SidebarGroupLabel>Inventario</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemsInventory.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url}>
                        <item.icon />
                        {item.title}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
