import { Eye, EyeOff, Loader2, UploadCloud } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../shared/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../shared/components/ui/form";
import { Input } from "../../../shared/components/ui/input";
import { z } from "zod";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { API } from "../../../shared/js/api";
import { ToasMessage } from "../../../components/ToasMessage";
import useStoreLogin from "../../../shared/state/useStoreLogin";

const RegisterSchema = z.object({
    name: z.string().nonempty("Campo requerido."),
    email: z.string().email("Email inválido").nonempty("Campo requerido."),
    passwordHash: z.string().min(6, "Mínimo 6 caracteres"),
    telephone: z.string().nonempty("Campo requerido."),
});

const Config = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [visible, setVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageUrlRef = useRef<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { name, email, telephone, id, imageUrl } = useStoreLogin()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: name,
            email: email,
            passwordHash: '',
            telephone: telephone.toString(),
        },
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
        console.log(data)
        try {
            setVisible(true);

            const payload = {
                ...data,
                telephone: Number(data.telephone),
                imageUrl: imageUrlRef.current || imageUrl,
            };

            const response = await API.updateUser(id, payload);

            if (!response?.data || !response?.success) {
                ToasMessage({
                    title: "No registrado",
                    description: "No se pudo registrar el usuario.",
                    type: "warning",
                });
                return
            }
            form.reset({
                name: "",
                email: "",
                telephone: "",
                passwordHash: "",
            });

            setImagePreview(null);
            setSelectedFileName(null);
            imageUrlRef.current = null;
            ToasMessage({
                title: "Cuenta actulizada",
                description: "El usuario se ha registrado correctamente.",
                type: "success",
            });
            localStorage.clear();
            window.location.reload();
        } catch (err) {
            ToasMessage({
                title: "Ocurrio un error",
                description: "El usuario no fue registrado.",
                type: "error",
            });
            console.error("Ocurrió un error: ", err);
        } finally {
            setVisible(false);
        }
    }

    return (
        <div>
            <span className="text-sm text-gray-400">Configuración</span>
            <br />
            <br />

            <div className="w-full rounded-md ">
                <fieldset className="border  p-4 rounded-md">
                    <legend className="font-bold px-2">Actualizar cuenta</legend>
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
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
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
                                    Actualizar
                                </Button>

                            </div>
                        </form>
                    </FormProvider>
                </fieldset>
            </div>
        </div>
    );
};

export default Config;