import { ReactComponent as ClockSvg } from '../../assets/icons/CartPage/ChekoutModal/ClockIcon.svg';

const ClockIcon = ({ color = '#3D220D' }) => (
    <ClockSvg
        style={{ fill: color }}
        width='24'
        height='24'
    />
);

export default ClockIcon;