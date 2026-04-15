import { ReactComponent as WalletSvg } from '../../assets/icons/CartPage/ChekoutModal/WalletIcon.svg';

const WalletIcon = ({ color = '#3D220D' }) => (
    <WalletSvg
        style={{ fill: color }}
        width='24'
        height='24'
    />
);

export default WalletIcon;