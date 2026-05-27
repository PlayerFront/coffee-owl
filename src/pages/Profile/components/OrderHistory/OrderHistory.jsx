import React from "react";
import Button from "../../../../components/Button/Button";
import { useUserOrders } from "../../../../hooks/useOrders";
import OrderCard from "./OrderCard/OrderCard";
import './_order-history.scss';

const OrderHistory = ({ onBack }) => {
    const { orders, loading, error } = useUserOrders();

    if (loading) {
        return (
            <section className="order-history">
                <header className="order-history__header">
                    <h2>Мои заказы</h2>
                </header>
                <p className="order-history__loading">Загрузка...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="order-history">
                <header className="order-history__header">
                    <h2>Мои заказы</h2>
                </header>
                <p className="order-history__error">{error}</p>
                <Button
                    size='large'
                    variant='secondary'
                    onClick={onBack}
                >Назад</Button>
            </section>
        );
    }

    if (orders.length === 0) {
        return (
            <section className="order-history">
                <header className="order-history__header">
                    <h2>Мои заказы</h2>
                </header>
                <p className="order-history__empty">У вас пока нет заказов</p>
                <Button onClick={onBack}>Назад</Button>
            </section>
        );
    }

    return (
        <section className="order-history">
            <header className="order-history__header">
                <h2>Мои заказы</h2>
            </header>

            <div className="order-history__list">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>

            <div className='order-history__footer'>
                <Button
                    size='large'
                    variant='secondary'
                    onClick={onBack}
                >
                    Назад</Button>
            </div>
        </section>
    );

}

export default OrderHistory;