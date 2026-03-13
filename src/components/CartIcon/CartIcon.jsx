import { ReactComponent as CartSvg } from '../../assets/icons/TabBar/ShoppingCartIcon.svg';

const CartIcon = ({ color = '#ECD1BC', active = false }) => (
    <CartSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default CartIcon;