
import { Folder, ListTodo, MonitorCheck, Settings2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../shared/components/ui/tabs"
import Tasks from "../../../tasks/Tasks"
import Repository from "../../../repository/Repository"
import ConfigUser from "./ConfigUser"
import { Button } from "../../../../../shared/components/ui/button"
import { useState } from "react"
import InboxUser from "./InboxUser"

export function TabUserView({ user }: any) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Tabs defaultValue="tasks" className="w-full">
                <Button variant="outline" onClick={() => setOpen(true)} className="w-fit mb-2"><Settings2 />Configurar Usuario</Button>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="tasks"><ListTodo /><span className="hidden md:block">Tareas</span></TabsTrigger>
                    <TabsTrigger value="activity"><MonitorCheck /> <span className="hidden md:block">Actividades</span></TabsTrigger>
                    <TabsTrigger value="repository"><Folder /> <span className="hidden md:block">Repositorio</span></TabsTrigger>
                </TabsList>
                <TabsContent value="tasks">
                    <Tasks />
                </TabsContent>
                <TabsContent value="activity">
                    <InboxUser />
                </TabsContent>
                <TabsContent value="repository">
                    <Repository />
                </TabsContent>
            </Tabs>
            <ConfigUser open={open} user={user} setOpen={setOpen} />
        </>
    )
}
