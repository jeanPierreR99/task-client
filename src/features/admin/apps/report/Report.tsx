import useStoreLogin from '../../../../shared/state/useStoreLogin';
import DashBoard from '../../users/view-user/components/DashBoard';

const Report = () => {
    const { id } = useStoreLogin()
    return (
        <div>
            <span className='text-sm text-gray-400'>Reporte personal</span>
            <br />
            <br />
            <DashBoard userId={id} />
        </div>
    );
};

export default Report;