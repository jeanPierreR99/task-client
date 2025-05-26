
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../shared/components/ui/tabs"
import { API } from "../../../../../shared/js/api"
import useStoreLogin from "../../../../../shared/state/useStoreLogin"
import Tab1 from "./Tab1"
import Tab3 from "./Tab3"


export function TabTasks() {
  const { projectId } = useStoreLogin();
  const [task, setTask] = useState<any[] | []>([])

  useEffect(() => {
    const getTaskStatus = async () => {
      const response = await API.getTasksStatusUser(projectId, "false")
      setTask(response.data)
    }

    getTaskStatus()
  }, [])

  return (
    <Tabs defaultValue="assigned" className="w-full">
      <div className='flex gap-2 items-center'>
        <div> <span className='text-xl font-bold'>Tareas del proyecto</span>
          <TabsList className="grid w-full grid-cols-2 gap-4">
            <TabsTrigger value="assigned">Completadas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent value="assigned">
        <TabsContent value="assigned">
          <Tab1 />
        </TabsContent>

      </TabsContent>
      <TabsContent value="pending">
        <Tab3 task={task}></Tab3>
      </TabsContent>
    </Tabs>
  )
}
