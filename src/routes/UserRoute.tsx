import { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "../shared/layout/Layout";
import React from "react";

const LoadingFallback = () => <div className="min-w-screen min-h-screen bg-gray-100/70  flex justify-center items-center">
    <Loader2 className="animate-spin text-blue-500" />
</div>;
const Home = React.lazy(() => import("../features/admin/apps/home/Home"));
const Tasks = React.lazy(() => import("../features/admin/apps/tasks/Tasks"));
const Notification = React.lazy(() => import("../features/admin/apps/notification/Notification"));
const Repository = React.lazy(() => import("../features/admin/apps/repository/Repository"));

const withSuspense = (Component: React.ReactNode) => (
    <Suspense fallback={<LoadingFallback />}>{Component}</Suspense>
);

export const UserRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <div>Ocurrio un error </div>,
        children: [
            {
                index: true,
                element: withSuspense(<Home />),
            },
            {
                path: "tasks",
                element: withSuspense(<Tasks />),
            },
            {
                path: "activity",
                element: withSuspense(<Notification />),
            },
            {
                path: "repository",
                element: withSuspense(<Repository />),
            },
        ],
    },
];