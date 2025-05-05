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
    siglas: z.string().nonempty("Campo requerido."),
});

type RoleFormValues = z.infer<typeof RoleSchema>;

const FormOffice = () => {
    const [loading, setLoading] = useState(false);

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(RoleSchema),
    });

    const onSubmit = async (data: z.infer<typeof RoleSchema>) => {
        try {
            setLoading(true);
            const response = await API.createOffice(data);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "No registrado",
                    description: "No se pudo registrar el rol.",
                    type: "warning",
                });
                return;
            }

            form.reset({
                name: "",
                siglas: ""
            });
            ToasMessage({
                title: "Oficina registrado",
                description: "La oficina ha sido registrado correctamente.",
                type: "success",
            });
        } catch (error) {
            console.error("Error al registrar la oficina:", error);
            ToasMessage({
                title: "Error",
                description: "Ocurrió un error al registrar la oficina.",
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
                    <legend className="font-bold px-2">Registrar Oficina</legend>
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
                                        <FormLabel>Nombre de la Oficina</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. Administración" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="siglas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Siglas</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej. ADM" {...field} />
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

export default FormOffice;
