import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { API } from "../../../shared/js/api";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../shared/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../shared/components/ui/select";

const RegisterSchema = z.object({
    name: z.string().nonempty("Campo requerido."),
    email: z.string().email("Email inválido").nonempty("Campo requerido."),
    passwordHash: z.string().min(6, "Mínimo 6 caracteres"),
    roleId: z.string().nonempty("Campo requerido."),
});

type Role = { id: string; name: string };

const RegistroModal = ({ close }: { close: () => void }) => {
    const [visible, setVisible] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageUrlRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    useEffect(() => {
        const getRole = async () => {
            const response = await API.getRole();
            setRoles(response.data);
        };
        getRole();
    }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setSelectedFileName(file.name);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await API.upload(formData);
            console.log(res)
            imageUrlRef.current = res.url;
            setImagePreview(res.url);
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
                ...data,
                image: imageUrlRef.current,
            };

            const res = await API.register(payload);
            console.log(res)
            alert("Usuario registrado correctamente");
            form.reset();
            setImagePreview(null);
            setSelectedFileName(null);
            imageUrlRef.current = null;
            close();
        } catch (err) {
            alert("Error al registrar usuario");
        } finally {
            setVisible(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 z-20 flex items-center justify-center">
            <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={close}
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold mb-4">Registro de Usuario</h3>

                {visible && (
                    <div className="absolute inset-0 bg-white/60 flex justify-center items-center z-10">
                        <Loader2 className="animate-spin" />
                    </div>
                )}

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 relative z-0"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control={form.control}
                            name="passwordHash"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Contraseña" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Imagen de perfil */}
                        <FormItem>
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
                                <p className="text-sm text-blue-500">Subiendo imagen...</p>
                            )}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-full object-cover mt-2"
                                />
                            )}
                        </FormItem>

                        {/* Rol con shadcn */}
                        <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
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

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-500 text-white"
                        >
                            Registrar
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default RegistroModal;
