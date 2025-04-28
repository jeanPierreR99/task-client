import { create } from 'zustand';

export type Notification = {
    message: string;
    setMessage: (message: string) => void;
};

const useStoreNotification = create<Notification>((set) => ({
    message: "",

    setMessage: (message) => set({ message })  // Establecer el mensaje
}));

export default useStoreNotification;
