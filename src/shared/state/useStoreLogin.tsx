import { create } from 'zustand';


interface ILogin {
    isLogIn: boolean;
    id: string;
    role: string;
    name: string;
    imageUrl: string;
    email: string;
    telephone: string;
    projectId: string;
    login: (role: string, name: string, imageUrl: string, email: string, id: string, telephone: string, projectId: string) => void;
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
    projectId: "",
    login: (role, name, imageUrl, email, id, telephone, projectId) => set(() => ({ isLogIn: true, role, name, imageUrl, email, id, telephone, projectId })),
    logout: () => set(() => ({ isLogIn: false, role: "", name: "", imageUrl: "", email: "", telephone: "", projectId: "" }))
}));

export default useStoreLogin;