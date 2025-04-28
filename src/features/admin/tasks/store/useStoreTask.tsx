import { create } from 'zustand'

export type User = {
    id: string
    name: string
    email: string
    passwordHash: string
    imageUrl: string
    roleId: string
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
}

const useStoreTask = create<TaskStore>((set) => ({
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

}))

export default useStoreTask
