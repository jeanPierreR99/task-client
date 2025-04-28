import axios from "axios";
import { CreateRoleDto, CreateSubtaskDto, CreateTaskDto, CreateUserDto, UpdateSubtaskDto, UpdateTaskDto } from "./interface";

export const API_PATH = "http://192.168.52.170:3000";

const api = axios.create({
    baseURL: API_PATH,
    headers: {
        "Content-Type": "application/json",
    },
});

export const API = {
    //user
    getUserSugestion: async (search: string) => {
        const response = await api.get(`/users/search?q=${search}`)
        return response.data
    },

    login: async (data: any) => {
        const response = await api.post("/users/login", data)
        return response.data
    },
    register: async (data: CreateUserDto) => {
        const response = await api.post("/users", data)
        return response.data
    },
    getUser: async () => {
        const response = await api.get("/users")
        return response.data
    },
    getUserId: async (userId: string) => {
        const response = await api.get(`/users/search/${userId}`)
        return response.data
    },
    changeUserRole: async (userId: string, roleId: string) => {
        const response = await api.patch(`/users/${userId}/role`, { roleId });
        return response.data;
    },

    changeUserActiveStatus: async (userId: string, isActive: boolean) => {
        const response = await api.patch(`/users/${userId}/active`, { isActive });
        return response.data;
    },

    //category
    setCategory: async (data: any) => {
        const response = await api.post("/categories", data)
        return response.data
    },
    getCategoryByUser: async (userId: string) => {
        const response = await api.get("/categories/user/" + userId)
        return response.data
    },
    getCategoryByResponsible: async (userId: string, status: string) => {
        const response = await api.get("/categories/assigned/" + userId + "?status=" + status)
        return response.data
    },

    deleteCategoryByTask: async (categoryId: string) => {
        const response = await api.delete("/categories/" + categoryId)
        return response.data
    },

    //role
    getRole: async () => {
        const response = await api.get("/roles")
        return response.data
    },
    createRole: async (data: CreateRoleDto) => {
        const response = await api.post("/roles", data)
        return response.data
    },

    //upload && files
    upload: async (formData: FormData) => {
        const response = await api.post("/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    uploadByUserId: async (userId: string, formData: FormData) => {
        const response = await api.post("/files/" + userId, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    uploadFilesToSubTask: async (idSubTask: string, formData: FormData) => {
        const response = await api.post("/files/subtask/" + idSubTask, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getFilesByUserId: async (userId: string) => {
        const response = await api.get("/files/user/" + userId)
        return response.data
    },
    getFileBySubTask: async (idSubTask: string) => {
        const response = await api.get("/files/subtask/" + idSubTask)
        return response.data
    },
    getFileByTask: async (idTask: string) => {
        const response = await api.get("/files/task/" + idTask)
        return response.data
    },
    createFolderByUser: async (userId: string, folderName: any) => {
        const response = await api.post(`/files/directory/${userId}`, folderName)
        return response.data
    },

    getFolderByUser: async (userId: string) => {
        const response = await api.get(`/files/directory/${userId}`)
        return response.data
    },

    getFolderContent: async (userId: string, nameFolder: string) => {
        const response = await api.get(`/files/folder/${userId}/${nameFolder}`);
        return response.data
    },
    uploadFileFoler: async (userId: string, folderName: string, formData: FormData) => {
        const response = await api.post(`/files/folder/${userId}/${folderName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    //TASK
    createTask: async (data: CreateTaskDto) => {
        const response = await api.post("/tasks", data)
        return response.data
    },
    updateTaskByCategory: async (idTask: string, idCategory: string) => {
        const response = await api.patch(`/tasks/category?id_task=${idTask}&id_category=${idCategory}`)
        return response.data
    },
    UpdateTask: async (idTask: string, data: UpdateTaskDto) => {
        const response = await api.put(`/tasks/${idTask}`, data);
        return response.data;
    },
    getTasksFileByTask: async (idTask: string) => {
        const response = await api.get(`/tasks/files/task/${idTask}`);
        return response.data;
    },
    deleteTaskById: async (idTask: string, userId: string) => {
        const response = await api.delete(`/tasks/${idTask}/user/${userId}`);
        return response.data;
    },
    getTasksStatusUser: async (idUser: string, status: string) => {
        const response = await api.get(`/tasks/${status}/user/${idUser}`);
        return response.data;
    },

    //SUBTASK
    createSubTask: async (data: CreateSubtaskDto) => {
        const response = await api.post("/subtasks", data)
        return response.data
    },
    getSubTaskByTask: async (taskId: string) => {
        const response = await api.get("/subtasks/task/" + taskId)
        return response.data
    },

    updateSubTask: async (idSubTask: string, data: UpdateSubtaskDto) => {
        const response = await api.put("/subtasks/" + idSubTask, data)
        return response.data
    },

    //COMMENTS
    createComment: async (formData: FormData) => {
        const response = await api.post("/comments", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },
    getCommentByTask: async (taskId: string) => {
        const response = await api.get("/comments/task/" + taskId)
        return response.data
    },

    getAllActivities: async (limit: any, offset: any) => {
        const response = await api.get(`/activities?limit=${limit}&offset=${offset}`)
        return response.data
    },
    getByUserActivities: async (id: string) => {
        const response = await api.get("/activities/user/" + id)
        return response.data
    },
    getByTaskActivities: async (id: string) => {
        const response = await api.get("/activities/task/" + id)
        return response.data
    },
};