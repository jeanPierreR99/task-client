import TableRole from './components/TableRole';
import TableUser from './components/TableUser';

const ListUser = () => {
    return (
        <div>
            <span className='text-sm text-gray-400'>Lista de Usuarios</span>
            <br />
            <br />
            <TableRole />
            <br />
            <br />
            <TableUser></TableUser>
        </div>
    );
};

export default ListUser;