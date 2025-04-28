import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchData = async (fetchFunction: () => Promise<any>) => {
    return await fetchFunction();
};

const useApiFetch = (
    queryKey: string[],
    fetchFunction: () => Promise<any>
): UseQueryResult<any, Error> => {
    return useQuery({
        queryKey,
        queryFn: () => fetchData(fetchFunction),
    });
};

export default useApiFetch;




// import { useEffect } from "react";
// import useApiFetch from "./hooks/useApiFetch"; // Asegúrate de que la ruta sea correcta

// type UserType = {
//   id: number | string;
//   name: string;
// };

// const MyComponent = () => {
//   // Definir el fetch function
//   const fetchUsers = async () => {
//     const response = await fetch("http://localhost:3000/users");
//     return response.json();
//   };

//   // Usar useApiFetch con la clave "users" y la función fetch
//   const { data, error, isLoading } = useApiFetch(
//     ["users"], // queryKey único para esta consulta
//     fetchUsers
//   );

//   useEffect(() => {
//     if (data) {
//       console.log("Usuarios obtenidos:", data);
//     }
//   }, [data]);

//   if (isLoading) return <p>Cargando...</p>;
//   if (error) return <p>Error al cargar los usuarios: {error.message}</p>;

//   return (
//     <div>
//       <h1>Lista de Usuarios</h1>
//       <ul>
//         {data?.map((user: UserType) => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MyComponent;
