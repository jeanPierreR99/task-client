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
        <div className="grid h-screen bg-gray-50 grid-cols-1 md:grid-cols-2">
            <div className="hidden md:flex items-center justify-center bg-white">
                <img src="https://ablog.managemart.com/images/o_1dnpgpc711vd4r5d5e781f10vs8.png" alt="Login Illustration" className="object-contain w-full h-full animate-fade-in" />
            </div>

            <div className="flex items-center justify-center p-8 sm:p-4 bg-white md:bg-transparent">
                <div className="w-full max-w-lg space-y-8 bg-white p-8 sm:p-6 rounded-2xl shadow-orange-300/20 shadow-2xl">
                    <img src="logo.png" className="w-30 h-30 m-auto" alt="" />
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">ASANA OTI</h1>
                        <p className="mt-2 text-sm text-gray-400">Inicia sesión para continuar</p>
                    </div>


                    {loading && (
                        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl">
                            <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
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
                                                <Input className="bg-gray-100 w-full rounded-md" placeholder="Email" {...field} />
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
                                                <Input type="password" className="bg-gray-100 w-full rounded-md" placeholder="Contraseña" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {message && <AlertMessage message={message} />}
                            </div>

                            <div className="flex flex-col md:flex-row items-left gap-2 justify-between">
                                <div className="flex items-center">
                                    <input type="checkbox" id="rememberMe" className="mr-2" />
                                    <label htmlFor="rememberMe" className="text-sm text-gray-600">Recordar contraseña</label>
                                </div>
                                <a href="#" className="text-sm text-orange-500 hover:underline">¿Olvidaste tu contraseña?</a>
                            </div>

                            <div className="my-4 border-t border-gray-200"></div>

                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-400 text-white text-lg font-semibold rounded-lg py-3 transition-all"
                            >
                                Iniciar sesión
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">¿No tienes cuenta? <a href="#" className="text-orange-500 hover:underline">Regístrate</a></p>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
};

export default Login;
