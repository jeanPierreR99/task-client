import { create } from 'zustand';


interface ILogin {
    isLogIn: boolean;
    id: string;
    role: string;
    name: string;
    imageUrl: string;
    email: string;
    telephone: string;
    login: (role: string, name: string, imageUrl: string, email: string, id: string, telephone: string) => void;
    logout: () => void;
}

const useStoreLogin = create<ILogin>((set) => ({
    isLogIn: false,
    id: "",
    role: "",
    name: "",
    imageUrl: "",
    email: "",
    telephone: "",
    login: (role, name, imageUrl, email, id, telephone) => set(() => ({ isLogIn: true, role, name, imageUrl, email, id, telephone })),
    logout: () => set(() => ({ isLogIn: false, role: "", name: "", imageUrl: "", email: "", telephone: "" }))
}));

export default useStoreLogin;