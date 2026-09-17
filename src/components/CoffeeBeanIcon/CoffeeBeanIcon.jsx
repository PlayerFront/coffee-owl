import { ReactComponent as CoffeeBeanSvg } from '../../assets/icons/ProfilePage/SupportFAQ/coffeeBeanIcon.svg';

const CoffeeBeanIcon = ({ color = '#3D220D' }) => (
    <CoffeeBeanSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default CoffeeBeanIcon;