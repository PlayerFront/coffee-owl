import { ReactComponent as OrdersSvg } from '../../assets/icons/ProfilePage/OrdersIcon.svg';

const OrdersIcon = ({ color = '#3D220D' }) => (
    <OrdersSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default OrdersIcon;