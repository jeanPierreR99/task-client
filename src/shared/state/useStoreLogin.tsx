import { create } from 'zustand';


interface ILogin {
    isLogIn: boolean;
    id: string;
    role: string;
    name: string;
    imageUrl: string;
    email: string;
    login: (role: string, name: string, imageUrl: string, email: string, id: string) => void;
    logout: () => void;
}

const useStoreLogin = create<ILogin>((set) => ({
    isLogIn: false,
    id: "",
    role: "",
    name: "",
    imageUrl: "",
    email: "",
    login: (role, name, imageUrl, email, id) => set(() => ({ isLogIn: true, role, name, imageUrl, email, id })),
    logout: () => set(() => ({ isLogIn: false, role: "", name: "", imageUrl: "", email: "" }))
}));

export default useStoreLogin;