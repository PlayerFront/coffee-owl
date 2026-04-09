import React from 'react';
import useCart from '../../utils/useCart';
import { Products } from '../Catalog/mockData';
import CartItem from './components/CartItem/CartItem';
import Button from '../../components/Button/Button';
import './_cart.scss';
import CartIcon from '../../components/CartIcon/CartIcon';

const Cart = ({ onTabChange }) => {

    const { cart, getQuantity, addToCart, removeFromCart } = useCart();

    const cartItems = Products.filter(product => getQuantity(product.id) > 0);
    const totalItems = cartItems.reduce((sum, product) => {
        return sum + getQuantity(product.id);
    }, 0)
    const total = cartItems.reduce((sum, product) => {
        return sum + product.price * getQuantity(product.id);
    }, 0);

    if (cartItems.length === 0) {
        return (
            <section className='cart cart--empty'>
                <h1>Корзина</h1>
                <div className="cart__empty-content">
                    <div className="cart__empty-icon">
                        <CartIcon
                            color="#3D220D"
                        />
                    </div>
                    <p className="cart__empty-text">Корзина пуста</p>
                </div>

                <div className="cart__empty-footer">
                    <Button
                        variant='primary'
                        size='large'
                        onClick={() => onTabChange('catalog')}
                    >
                        Перейти в каталог
                    </Button>
                </div>
            </section>
        );
    };

    return (
        <section className='cart'>
            <h1>Корзина ({totalItems})</h1>
            <div className='cart__items'>
                {cartItems.map(product => (
                    <CartItem
                        key={product.id}
                        product={product}
                        quantity={getQuantity(product.id)}
                        onAdd={() => addToCart(product.id)}
                        onRemove={() => removeFromCart(product.id)}
                    />
                ))}
            </div>

            <div className='cart__footer'>
                <div className='cart__total'>
                    <span>Итого:</span>
                    <span>{total} ₽</span>
                </div>
                <Button
                    variant='primary'
                    size='large'
                >
                    Оформить заказ
                </Button>
            </div>
        </section>
    )
};

export default Cart;