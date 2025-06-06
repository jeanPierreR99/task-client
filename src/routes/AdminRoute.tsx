import { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Layout from "../shared/layout/Layout";
import React from "react";
import ViewProject from "../features/admin/users/view-project/ViewProject";

const LoadingFallback = () => <div className="min-w-screen min-h-screen bg-gray-100/70  flex justify-center items-center">
    <Loader2 className="animate-spin text-blue-500" />
</div>;
const Home = React.lazy(() => import("../features/admin/apps/home/Home"));
const Tasks = React.lazy(() => import("../features/admin/apps/tasks/Tasks"));
const Inbox = React.lazy(() => import("../features/admin/users/inbox/Inbox"));
const Repository = React.lazy(() => import("../features/admin/apps/repository/Repository"));
const RegisterUser = React.lazy(() => import("../features/admin/users/register/RegisterUser"));
const ListUser = React.lazy(() => import("../features/admin/users/list/ListUser"));
const ViewUser = React.lazy(() => import("../features/admin/users/view-user/ViewUser"));
const Notification = React.lazy(() => import("../features/admin/apps/notification/Notification"));
const PrintScanner = React.lazy(() => import("../features/admin/inventory/printScanner"))
const Config = React.lazy(() => import("../features/admin/config/Config"))
const AllTasks = React.lazy(() => import("../features/admin/apps/allTasks/AllTasks"))
const AllTickets = React.lazy(() => import("../features/admin/apps/allTickets/AllTickets"))
const TaskMe = React.lazy(() => import("../features/admin/apps/task-me/TaskMe"))
const Report = React.lazy(() => import("../features/admin/apps/report/Report"))

const withSuspense = (Component: React.ReactNode) => (
    <Suspense fallback={<LoadingFallback />}>{Component}</Suspense>
);

export const AdminRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <div>Ocurrio un error</div>,
        children: [
            {
                index: true,
                element: withSuspense(<Home />),
            },
            {
                path: "config",
                element: withSuspense(<Config />),
            },
            {
                path: "tasks",
                element: withSuspense(<Tasks />),
            },
            {
                path: "tasks-me",
                element: withSuspense(<TaskMe />),
            },
            {
                path: "projects",
                children: [
                    {
                        path: "view/:id",
                        element: withSuspense(<ViewProject />),
                    }
                ]
            },
            {
                path: "all-tasks",
                element: withSuspense(<AllTasks />),
            },
            {
                path: "all-tickets",
                element: withSuspense(<AllTickets />),
            },
            {
                path: "activity",
                element: withSuspense(<Notification />),
            },
            {
                path: "repository",
                element: withSuspense(<Repository />),
            },
            {
                path: "report",
                element: withSuspense(<Report />),
            },
            {
                path: "users",
                children: [
                    {
                        path: "register",
                        element: withSuspense(<RegisterUser />),
                    },
                    {
                        path: "list",
                        element: withSuspense(<ListUser />),
                    },
                    {
                        path: "view/:id",
                        element: withSuspense(<ViewUser />),
                    },
                    {
                        path: "activities",
                        element: withSuspense(<Inbox />),
                    },
                ]
            },
            {
                path: "inventory",
                children: [
                    {
                        path: "print-scanners",
                        element: withSuspense(<PrintScanner />),
                    },
                    {
                        path: "list",
                        element: withSuspense(<ListUser />),
                    },
                    {
                        path: "view/:id",
                        element: withSuspense(<ViewUser />),
                    },
                    {
                        path: "activities",
                        element: withSuspense(<Inbox />),
                    },
                ]
            }
        ],
    },
];