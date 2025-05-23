import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import { Eye, EyeOff, Loader2, UploadCloud } from "lucide-react";
import { Input } from "../../../../../shared/components/ui/input";
import { Button } from "../../../../../shared/components/ui/button";
import { API } from "../../../../../shared/js/api";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../../shared/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../shared/components/ui/select";
import { ToasMessage } from "../../../../../components/ToasMessage";
import { MultiSelect } from "./MultiSelect";

const RegisterSchema = z.object({
    name: z.string().nonempty("Campo requerido."),
    email: z.string().email("Email inválido").nonempty("Campo requerido."),
    passwordHash: z.string().min(6, "Mínimo 6 caracteres"),
    telephone: z.string().nonempty("Campo requerido."),
    roleId: z.string().nonempty("Campo requerido."),
    projectIds: z.array(z.string()).nonempty("Selecciona al menos un proyecto"),
});

interface Role {
    id: string;
    name: string;
    userCount: number;
}


const FormUser = ({ roleData, projectData }: any) => {
    const [visible, setVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageUrlRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setSelectedFileName(file.name);

        const localUrl = URL.createObjectURL(file);
        setImagePreview(localUrl);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await API.upload(formData);
            imageUrlRef.current = res.data.url;

        } catch (error) {
            alert("Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    async function onSubmit(data: z.infer<typeof RegisterSchema>) {
        try {
            setVisible(true);

            const payload = {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
                roleId: data.roleId,
                telephone: Number(data.telephone),
                imageUrl: imageUrlRef.current,
                projectId: data.projectIds[0],
                project: data.projectIds.map(id => ({ id })),
            };

            const response = await API.register(payload);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "No registrado",
                    description: "No se pudo registrar el usuario.",
                    type: "warning",
                });
                return;
            }

            form.reset();
            setImagePreview(null);
            setSelectedFileName(null);
            imageUrlRef.current = null;

            ToasMessage({
                title: "Usuario registrado",
                description: "El usuario se ha registrado correctamente.",
                type: "success",
            });
        } catch (err) {
            ToasMessage({
                title: "Ocurrió un error",
                description: "El usuario no fue registrado.",
                type: "error",
            });
            console.error("Ocurrió un error: ", err);
        } finally {
            setVisible(false);
        }
    }


    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex items-center justify-center">
            <div className="w-full rounded-md ">
                <fieldset className="border  p-4 rounded-md">
                    <legend className="font-bold px-2">Registrar Usuario</legend>
                    <FormProvider {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                        >
                            {/* Nombre */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* telephone */}
                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="N° de Telefono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Contraseña */}
                            <FormField
                                control={form.control}
                                name="passwordHash"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Contraseña"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground"
                                                >
                                                    {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Rol */}
                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecciona un rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roleData && roleData.map((role: Role) => (
                                                        <SelectItem key={role.id} value={String(role.id)}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Project */}
                            <FormField
                                control={form.control}
                                name="projectIds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Proyectos</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={projectData?.map((p: any) => ({
                                                    label: p.name,
                                                    value: p.id,
                                                })) ?? []}
                                                selected={field.value ?? []}
                                                onChange={field.onChange}
                                                placeholder="Selecciona uno o varios proyectos"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* Imagen de perfil */}
                            <FormItem className="">
                                <FormLabel>Imagen de Perfil</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <UploadCloud size={18} />
                                            Seleccionar foto
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {selectedFileName && (
                                            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                {selectedFileName}
                                            </span>
                                        )}
                                    </div>
                                </FormControl>
                                {uploading && (
                                    <p className="text-sm text-blue-500 mt-2">Subiendo imagen...</p>
                                )}
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-full object-cover mt-2"
                                    />
                                )}
                            </FormItem>

                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    className="float-right bg-orange-500 hover:bg-orange-400 text-white"
                                    disabled={visible}
                                >
                                    {visible && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
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

export default FormUser;
