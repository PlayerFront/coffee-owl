import { ReactComponent as EditSvg} from '../../assets/icons/ProfilePage/EditIcon.svg';

const EditIcon = ({ color = '#3D220D' }) => (
    <EditSvg
        style={{ fill: color }}
        width='24'
        height='24'
    />
);

export default EditIcon;