import { ReactComponent as TechSupportSvg } from '../../assets/icons/ProfilePage/TechSupportIcon.svg';

const TechSupportIcon = ({ color = '#3D220D' }) => (
    <TechSupportSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default TechSupportIcon;