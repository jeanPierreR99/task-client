import { useEffect, useState } from 'react';
import FormRole from './components/FormRole';
import FormUser from './components/FormUser';
import { API } from '../../../../shared/js/api';
import FormOffice from './components/FormOffice';
import FormProjects from './components/FormProjects';

const RegisterUser = () => {
    const [roleData, setRoleData] = useState();
    const [projectData, setProjectData] = useState();

    useEffect(() => {
        const getRoles = async () => {
            const response = await API.getRole();
            setRoleData(response.data)
        }

        const getProejcts = async () => {
            const response = await API.getProjects();
            setProjectData(response.data)
        }

        getRoles()
        getProejcts()
    }, [])
    return (
        <div>
            <FormRole setRoleData={setRoleData} />
            <br />
            <br />
            <FormOffice />
            <br />
            <br />
            <FormProjects setProjectData={setProjectData} />
            <br />
            <br />
            <FormUser roleData={roleData} projectData={projectData} />
        </div>
    );
};

export default RegisterUser;