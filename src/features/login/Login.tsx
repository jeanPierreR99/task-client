import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../shared/components/ui/form";
import { Input } from "../../shared/components/ui/input";
import { Button } from "../../shared/components/ui/button";
import { saveStorage } from "../../shared/js/functions";
import { API } from "../../shared/js/api";
import useStoreLogin from "../../shared/state/useStoreLogin";
import { AlertMessage } from "../../components/AlertMessage";

const LoginSchema = z.object({
    email: z.string().min(4, "Campo requerido.").email("Debe ser un correo válido."),
    passwordHash: z.string().min(4, "Campo requerido."),
});

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>("");
    const { login } = useStoreLogin();

    const loginForm = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    async function onSubmitLogin(user: z.infer<typeof LoginSchema>) {
        setMessage("");
        try {
            setLoading(true);
            const response = await API.login(user);

            if (!response.success || !response.data?.data) {
                setMessage(response.data?.message || "Error inesperado");
                return;
            }

            const userData = response.data.data;
            saveStorage(userData);
            login(
                userData.role.name,
                userData.name,
                userData.imageUrl,
                userData.email,
                userData.id
            );
            window.location.reload();
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setMessage("Error en la conexión al servidor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 bg-gray-50">
            {/* Left Illustration */}
            <div className="hidden md:flex items-center justify-center bg-white">
                <img src="portada.svg" alt="Login Illustration" className="w-3/4 animate-fade-in" />
            </div>

            {/* Right Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900">Bienvenido</h2>
                        <p className="mt-2 text-sm text-gray-500">Inicia sesión para continuar</p>
                    </div>

                    {loading && (
                        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl">
                            <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                        </div>
                    )}

                    <FormProvider {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)} className="space-y-6 relative">
                            <div className="space-y-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Correo electrónico</FormLabel>
                                            <FormControl>
                                                <Input className="bg-gray-100" placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="passwordHash"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Contraseña</FormLabel>
                                            <FormControl>
                                                <Input type="password" className="bg-gray-100" placeholder="Contraseña" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {message && <AlertMessage message={message} />}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-lg py-3 transition-all"
                            >
                                Iniciar sesión
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
};

export default Login;
