import { ReactComponent as AvatarSvg } from '../../assets/icons/ProfilePage/AvatarIcon.svg';

const AvatarIcon = ({ color = '#3D220D' }) => (
    <AvatarSvg
        style={{ fill: color }}
        width='79'
        height='69'
    />
);

export default AvatarIcon;