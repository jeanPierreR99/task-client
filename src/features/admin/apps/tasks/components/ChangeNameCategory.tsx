import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogFooter
} from "../../../../../shared/components/ui/alert-dialog"
import { z } from "zod"
import { Button } from "../../../../../shared/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../shared/components/ui/form"
import { useState } from "react"
import { API } from "../../../../../shared/js/api"
import { ToasMessage } from "../../../../../components/ToasMessage"
import { PenLine } from "lucide-react"
import { Input } from "../../../../../shared/components/ui/input"

const formSchema = z.object({
    title: z.string().min(1, "Campo requerido")
})

type FormValues = z.infer<typeof formSchema>

const ChangeNameCategory = ({ category }: any) => {

    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const updateCategoryName = async (data: FormValues) => {
        try {
            setLoading(true);
            const payload = {
                title: data.title,
            }

            const response = await API.updateCategory(category.id, payload);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "Aviso",
                    description: "No se pudo actualizar la etiqueta",
                    type: "warning",
                });
                return;
            }

            ToasMessage({
                title: "Modificado",
                description: "El nombre de la etiqueta fue actualizado",
                type: "success",
            });

            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar la etiqueta:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error: " + error,
                type: "error",
            });
            setLoading(false);
        }
    };


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                >
                    <PenLine className="text-orange-500" />
                </Button>
            </AlertDialogTrigger>


            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cambiar nombre de la categoria</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ingresa el nuevo nombre para la cateogria {category.title}.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(updateCategoryName)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de categoria</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Nuevo nombre de la tarea" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-fit bg-orange-500 hover:bg-orange-400 text-white"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Confirmar cambio"}
                        </Button>
                    </form>
                </Form>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ChangeNameCategory;
