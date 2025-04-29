import { create } from 'zustand'

export type File = {
    id: string
    name: string
    reference: string
    uploaded_in: string
    url: string
}

type FileStore = {
    files: File[]
    addFile: (file: File) => void
    removeFile: (id: string) => void
    setFiles: (files: File[]) => void
    clearFiles: () => void
}

const useStoreFile = create<FileStore>((set) => ({
    files: [],

    addFile: (file) =>
        set((state) => ({
            files: [...state.files, file],
        })),

    removeFile: (id) =>
        set((state) => ({
            files: state.files.filter((file) => file.id !== id),
        })),

    setFiles: (files) => set({ files }),

    clearFiles: () => set({ files: [] }),
}))

export default useStoreFile
