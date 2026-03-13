import { ReactComponent as ProfileSvg } from '../../assets/icons/TabBar/ProfileIcon.svg';

const ProfileIcon = ({ color = '#ECD1BC', active = false }) => (
    <ProfileSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default ProfileIcon;