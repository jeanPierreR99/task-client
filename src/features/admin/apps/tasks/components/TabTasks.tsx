
import { Calendar, File, ListCheck, Table2Icon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../shared/components/ui/tabs"
import TabContentList from "./TabContentList"
import TabContentTable from "./TabContentTable"
import TabContentCalendar from "./TabContentCalendar";
import TabContentFile from "./TabContentFIle";

export function TabTasks() {

    return (
        <Tabs defaultValue="list" className="w-full">

            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="list"><ListCheck></ListCheck><span className="hidden md:block">Lista</span></TabsTrigger>
                <TabsTrigger value="table"><Table2Icon></Table2Icon> <span className="hidden md:block">Tablero</span></TabsTrigger>
                <TabsTrigger value="calendar"><Calendar></Calendar> <span className="hidden md:block">Calendario</span></TabsTrigger>
                <TabsTrigger value="attachment"><File></File><span className="hidden md:block">Archivos</span></TabsTrigger>
            </TabsList>
            <TabsContent value="list">
                <TabContentList></TabContentList>
            </TabsContent>
            <TabsContent value="table">
                <TabContentTable />
            </TabsContent>
            <TabsContent value="calendar">
                <TabContentCalendar />
            </TabsContent>
            <TabsContent value="attachment">
                <TabContentFile />
            </TabsContent>
        </Tabs>
    )
}
