import { create } from 'zustand'

export type User = {
    id: string
    name: string
    email: string
    passwordHash: string
    imageUrl: string
    roleId: string
}

export type Office = {
    id: string;
    name: string;
    siglas: string
}

export type Task = {
    id: string
    name: string
    description: string
    completed: boolean
    status: string
    dateCulmined: string
    created_by: User
    responsible: User
    office: Office,
    ticket?: boolean;
    nameTicket?: string
}

export type Category = {
    id: string
    title: string
    index: boolean
    tasks: Task[]
}

type TaskStore = {
    categories: Category[]
    setCategories: (categories: Category[] | ((prev: Category[]) => Category[])) => void
    addCategory: (category: Category) => void
    addTaskToCategory: (categoryId: string, task: Task) => void
    clearCategories: () => void
    updateTaskById: (taskId: string, updates: Partial<Pick<Task, 'status' | 'completed'>>) => void
    removeCategory: (categoryId: string) => void
    findTasksByName: (searchTerm: string) => Task[],
    moveTaskToCategory: (taskId: string, targetCategoryId: string) => any,
    removeTaskFromCategory: (categoryId: string, taskId: string) => void

}

const useStoreTask = create<TaskStore>((set, get) => ({
    categories: [],
    setCategories: (categoriesOrFn) => {
        set((state) => ({
            categories:
                typeof categoriesOrFn === 'function'
                    ? categoriesOrFn(state.categories)
                    : categoriesOrFn,
        }))
    },
    addCategory: (category) =>
        set((state) => ({
            categories: [...state.categories, category],
        })),
    addTaskToCategory: (categoryId, task) =>
        set((state) => ({
            categories: state.categories.map((cat) =>
                cat.id === categoryId
                    ? { ...cat, tasks: [...cat.tasks, task] }
                    : cat
            ),
        })),
    clearCategories: () => set({ categories: [] }),
    updateTaskById: (taskId, updates) =>
        set((state) => ({
            categories: state.categories.map((cat) => ({
                ...cat,
                tasks: cat.tasks.map((task) =>
                    task.id === taskId
                        ? { ...task, ...updates }
                        : task
                ),
            })),
        })),
    removeCategory: (categoryId: string) =>
        set((state) => ({
            categories: state.categories.filter((cat) => cat.id !== categoryId),
        })),
    findTasksByName: (searchTerm) => {
        if (!searchTerm.trim()) return [];

        const lowerTerm = searchTerm.toLowerCase();

        return get().categories.flatMap((cat) =>
            cat.tasks.filter((task) =>
            (task.name?.toLowerCase().includes(lowerTerm) ||
                task.nameTicket?.toLowerCase().includes(lowerTerm))
            )
        );
    },
    moveTaskToCategory: (taskId: string, targetCategoryId: string) =>
        set((state) => {
            let taskToMove: Task | null = null;

            // Remover la tarea de su categoría actual
            const updatedCategories = state.categories.map((cat) => {
                const hasTask = cat.tasks.some((t) => t.id === taskId);
                if (hasTask) {
                    const filteredTasks = cat.tasks.filter((t) => {
                        if (t.id === taskId) {
                            taskToMove = t;
                            return false; // excluye la tarea
                        }
                        return true;
                    });
                    return { ...cat, tasks: filteredTasks };
                }
                return cat;
            });

            // Si no se encontró la tarea, no hacer nada
            if (!taskToMove) return { categories: updatedCategories };

            // Agregar la tarea a la nueva categoría
            const finalCategories = updatedCategories.map((cat) => {
                if (cat.id === targetCategoryId) {
                    return { ...cat, tasks: [...cat.tasks, taskToMove!] };
                }
                return cat;
            });

            return { categories: finalCategories };
        }),
    removeTaskFromCategory: (categoryId: string, taskId: string) =>
        set((state) => ({
            categories: state.categories.map((cat) => {
                if (cat.id === categoryId) {
                    return {
                        ...cat,
                        tasks: cat.tasks.filter((task) => task.id !== taskId),
                    };
                }
                return cat;
            }),
        })),

}))

export default useStoreTask
