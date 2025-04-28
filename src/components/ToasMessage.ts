import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning" | "default";

interface ToastOptions {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
}

export const ToasMessage = ({
    title,
    description = "",
    type = "default",
    duration = 3000,
    position = "top-right",
}: ToastOptions) => {
    toast(title, {
        description,
        duration,
        position,
        className: getClassName(type),
        icon: getIcon(type),
    });
};

const getIcon = (type: ToastType) => {
    switch (type) {
        case "success":
            return "✅";
        case "error":
            return "❌";
        case "info":
            return "ℹ️";
        case "warning":
            return "⚠️";
        default:
            return "🔔";
    }
};

const getClassName = (type: ToastType) => {
    switch (type) {
        case "success":
            return "bg-green-100 text-green-800 border border-green-300";
        case "error":
            return "bg-red-100 text-red-800 border border-red-300";
        case "info":
            return "bg-blue-100 text-blue-800 border border-blue-300";
        case "warning":
            return "bg-yellow-100 text-yellow-800 border border-yellow-300";
        default:
            return "bg-white text-gray-800 border border-gray-200";
    }
};
