import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdminRoutes } from "./routes/AdminRoute";
import { ClientRoutes } from "./routes/ClientRoute";
import { UserRoutes } from "./routes/UserRoute";
import useStoreLogin from "./shared/state/useStoreLogin";
import { getStorage } from "./shared/js/functions";

function App() {
    const { isLogIn, login, role } = useStoreLogin();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const data = getStorage();
        if (data) {
            login(data.role.name, data.name, data.imageUrl, data.email, data.id, data.telephone, data.projectId);
        }
        setIsAuthChecked(true);
    }, []);

    if (!isAuthChecked) {
        return <div className="text-center p-10">Verificando sesión...</div>;
    }

    const router = createBrowserRouter(
        isLogIn
            ? (role === "Administrador" ? AdminRoutes : UserRoutes)
            : ClientRoutes
    );

    return <RouterProvider router={router} />;
}

export default App;
