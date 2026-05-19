import { ReactComponent as SettingsSvg } from '../../assets/icons/ProfilePage/SettingsIcon.svg';

const SettingsIcon = ({ color = '#3D220D' }) => (
    <SettingsSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default SettingsIcon;