
import { Settings2 } from "lucide-react"
import ConfigUser from "./ConfigUser"
import { Button } from "../../../../../shared/components/ui/button"
import { useState } from "react"

export function TabUserView({ user }: any) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)} className="w-fit mb-2"><Settings2 />Configurar Usuario</Button>
            <ConfigUser open={open} user={user} setOpen={setOpen} />
        </>
    )
}
