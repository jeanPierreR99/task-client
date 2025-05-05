import { useEffect, useState } from 'react';
import FormRole from './components/FormRole';
import FormUser from './components/FormUser';
import { API } from '../../../../shared/js/api';
import FormOffice from './components/FormOffice';

const RegisterUser = () => {
    const [roleData, setRoleData] = useState();

    useEffect(() => {
        const getRoles = async () => {
            const response = await API.getRole();
            setRoleData(response.data)
        }
        getRoles()
    }, [])
    return (
        <div>
            <span className='text-sm text-gray-400'>Registro de Roles</span>
            <br />
            <br />
            <FormRole setRoleData={setRoleData} />
            <br />
            <span className='text-sm text-gray-400'>Registro de Usuarios</span>
            <br />
            <br />
            <FormUser roleData={roleData} />
            <br />
            <span className='text-sm text-gray-400'>Registro de Oficinas</span>
            <br />
            <br />
            <FormOffice />
        </div>
    );
};

export default RegisterUser;