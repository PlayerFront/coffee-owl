import { ReactComponent as PurchaseSvg } from '../../assets/icons/CartPage/ChekoutModal/PurchaseIcon.svg';

const PurchaseIcon = ({ color = '#3D220D' }) => (
    <PurchaseSvg
        style={{ fill: color }}
        width='24'
        height='24'
    />
);

export default PurchaseIcon;