import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import './_checkout-modal.scss';
import LocationIcon from "../../../../components/LocationIcon/LocationIcon";
import WalletIcon from "../../../../components/WalletIcon/WalletIcon";
import PurchaseIcon from "../../../../components/PurchaseIcon/PurchaseIcon";
import YandexMap from "../../../../components/YandexMap/YandexMap";


const CheckOutModal = ({ isOpen, onClose, cartItems, total, getQuantity }) => {


    const [paymentMethod, setPaymentMethod] = useState('cash');

    if (!isOpen) return null;

    return (
        <div className="checkout-modal__overlay">
            <div className="checkout-modal">
                <h2 className="checkout-modal__title">Оформление заказа</h2>

                <div className='checkout-modal__section'>
                    <div className='checkout-modal__header'>
                        <LocationIcon />
                        <h3>Адрес кофейни</h3>
                    </div>
                    <p>ул. Пушкина, д. 10, Coffee Owl</p>
                        <YandexMap />
                </div>

                <div className='checkout-modal__section'>
                    <div className='checkout-modal__header'>
                        <WalletIcon />
                        <h3>Способ оплаты при получении</h3>
                    </div>
                    <div className='checkout-modal__payment-buttons'>
                        <label className="checkout-modal__radio">
                            <input
                                type="radio"
                                name="payment"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                            />
                            <span className="checkout-modal__radio-custom"></span>
                            Наличными
                        </label>
                        <label className="checkout-modal__radio">
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                            />
                            <span className="checkout-modal__radio-custom"></span>
                            Картой
                        </label>
                    </div>
                </div>

                <div className='checkout-modal__section'>
                    <div className='checkout-modal__header'>
                        <PurchaseIcon />
                        <h3>Ваш заказ</h3>

                    </div>
                    {cartItems.map(product => (
                        <div key={product.id} className='checkout-modal__item'>
                            <span> {product.name} x {getQuantity(product.id)} </span>
                            <span> {product.price * getQuantity(product.id)} ₽ </span>
                        </div>
                    ))}
                    <div className='checkout-modal__total'>
                        <span>Итого:</span>
                        <span>{total} ₽ </span>
                    </div>
                </div>

                <div className='checkout-modal__buttons'>
                    <Button variant='primary' size='large' onClick={() => alert('Заказ оформлен!')}>
                        Подтвердить
                    </Button>
                    <Button variant='secondary' size='large' onClick={onClose}>
                        Вернуться к заказу
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckOutModal;