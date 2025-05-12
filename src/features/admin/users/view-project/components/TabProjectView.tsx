
import { Folder, ListTodo } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../shared/components/ui/tabs"
import Tasks from "../../../apps/tasks/Tasks"
import Repository from "../../../apps/repository/Repository"

export function TabProjectView() {
    return (
        <>
            <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="tasks"><ListTodo /><span className="hidden md:block">Tareas</span></TabsTrigger>
                    <TabsTrigger value="repository"><Folder /> <span className="hidden md:block">Repositorio</span></TabsTrigger>
                </TabsList>
                <TabsContent value="tasks">
                    <Tasks />
                </TabsContent>
                <TabsContent value="repository">
                    <Repository />
                </TabsContent>
            </Tabs>
        </>
    )
}
