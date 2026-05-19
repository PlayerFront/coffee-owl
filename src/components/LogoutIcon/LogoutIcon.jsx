import { ReactComponent as LogoutSvg } from '../../assets/icons/ProfilePage/LogoutIcon.svg';

const LogoutIcon = ({ color = '#3D220D' }) => (
    <LogoutSvg
        style={{ fill: color }}
        width='20'
        height='20'
    />
);

export default LogoutIcon;