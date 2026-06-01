import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import './_checkout-modal.scss';
import LocationIcon from "../../../../components/LocationIcon/LocationIcon";
import WalletIcon from "../../../../components/WalletIcon/WalletIcon";
import PurchaseIcon from "../../../../components/PurchaseIcon/PurchaseIcon";
import YandexMap from "../../../../components/YandexMap/YandexMap";
import { getUserFromStorage } from "../../../../utils/authStorage";
import { createOrder } from "../../../../api/orderApi";
import { formatTimeForDB, getAvailableTimes } from "../../../../utils/timeUtils";
import ClockIcon from "../../../../components/ClockIcon/ClockIcon";
import AcceptIcon from '../../../../components/AcceptIcon/AcceptIcon';


const CheckOutModal = ({ isOpen, onClose, cartItems, total, getQuantity, onTabChange, onClearCart }) => {

    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [pickupTime, setPickupTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const handleOrderSubmit = async () => {
        if (isSubmitting) return;

        const user = getUserFromStorage();
        if (!user?.id) {
            setSubmitError('Ошибка авторизации. Пожалуйста, перезайдите в аккаунт.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const orderItems = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: getQuantity(item.id)
            }));

            const order = await createOrder(
                user.id,
                orderItems,
                total,
                formatTimeForDB(pickupTime),
                paymentMethod
            );

            setOrderNumber(order.display_id);
            setIsSuccess(true);
            onClearCart();

        } catch (error) {
            console.error('Order submit error:', error);
            setSubmitError(
                error.message === 'Failed to create order'
                    ? 'Не удалось оформить заказ'
                    : error.message
            );
        } finally {
            setIsSubmitting(false);
        };
    }


    if (!isOpen) return null;

    return (

        <div className="checkout-modal__overlay">
            <div className="checkout-modal">
                {isSuccess ? (
                    <>
                        <div className="checkout-modal__success">
                            <AcceptIcon />
                            <h2 className='checkout-modal__title'>Заказ оформлен!</h2>
                            <p>Номер заказа: <strong>{orderNumber}</strong></p>
                            <p>Заказ будет готов к <strong>{pickupTime}</strong></p>
                            <p>Ждем вас в Coffee-Owl</p>
                        </div>
                        <div className='checkout-modal__buttons'>
                            <Button
                                variant='primary'
                                size='large'
                                onClick={() => {
                                    onClose();
                                    onTabChange?.('profile', { initialView: 'orders' });
                                }}
                            >
                                Перейти к заказам
                            </Button>
                            <Button
                                variant='secondary'
                                size='large'
                                onClick={() => {
                                    onClose();
                                    onTabChange?.('catalog');
                                }}
                            >
                                Вернуться в каталог
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="checkout-modal__title">Оформление заказа</h2>

                        <div className='checkout-modal__section'>
                            <div className='checkout-modal__header'>
                                <LocationIcon />
                                <h3>Адрес кофейни</h3>
                            </div>
                            <p>ул. Пушкина, д. 10, Coffee Owl</p>
                            <p>Режим работы: с 9:00 до 22:00</p>
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

                        <div className="checkout-modal__section">
                            <div className='checkout-modal__header'>
                                <ClockIcon />
                                <h3>Приготовить к</h3>
                            </div>
                            <select
                                className="checkout-modal__select"
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                            >
                                <option value="" disabled>Выберите время</option>
                                {getAvailableTimes().map(time => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            {getAvailableTimes().length === 0 && (
                                <p className="checkout-modal__hint">
                                    Сегодня заказы больше не принимаются. Попробуйте завтра с 9:00.
                                </p>
                            )}
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

                        {submitError && (
                            <div className="checkout-modal__error">
                                {submitError}
                            </div>
                        )}

                        <div className='checkout-modal__buttons'>
                            <Button
                                variant='primary'
                                size='large'
                                disabled={!pickupTime || isSubmitting}
                                onClick={handleOrderSubmit}
                            >
                                {isSubmitting ? 'Оформление...' : 'Подтвердить'}
                            </Button>
                            <Button
                                variant='secondary'
                                size='large'
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Вернуться к заказу
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckOutModal;