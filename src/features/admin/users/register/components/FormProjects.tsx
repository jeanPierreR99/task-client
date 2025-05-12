import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../../../shared/components/ui/input";
import { Button } from "../../../../../shared/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../../shared/components/ui/form";
import { API } from "../../../../../shared/js/api";
import { ToasMessage } from "../../../../../components/ToasMessage";
import { useState } from "react";

const RoleSchema = z.object({
    name: z.string().nonempty("Campo requerido."),
    description: z.string().nonempty("Campo requerido."),
});

type RoleFormValues = z.infer<typeof RoleSchema>;

const FormProjects = ({ setProjectData }: any) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(RoleSchema),
    });

    const onSubmit = async (data: z.infer<typeof RoleSchema>) => {
        try {
            setLoading(true);
            const response = await API.createProject(data);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "No registrado",
                    description: "No se pudo registrar el Proyecto.",
                    type: "warning",
                });
                return;
            }

            form.reset({
                name: "",
                description: ""
            });
            setProjectData((prev: any) => [...prev, response.data])
            ToasMessage({
                title: "Proyecto registrado",
                description: "El Proyecto ha sido registrado correctamente.",
                type: "success",
            });
        } catch (error) {
            console.error("Error al registrar el Proyecto:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al registrar el Proyecto.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full rounded-md">
                <fieldset className="border p-4 rounded-md">
                    <legend className="font-bold px-2">Registrar Proyecto</legend>
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid md:grid-cols-2 gap-6 mt-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre del Proyecto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Nuevo proyecto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Encargados de soporte" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end col-span-2">
                                <Button
                                    type="submit"
                                    className="float-right bg-orange-500 hover:bg-orange-400 text-white"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                                    )}
                                    Registrar
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </fieldset>
            </div>
        </div>
    );
};

export default FormProjects;
