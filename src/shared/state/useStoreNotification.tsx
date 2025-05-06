import { create } from 'zustand';

export type Notification = {
    message: string;
    setMessage: (message: string) => void;
};

const useStoreNotification = create<Notification>((set) => ({
    message: "",

    setMessage: (message) => set({ message })
}));

export default useStoreNotification;
