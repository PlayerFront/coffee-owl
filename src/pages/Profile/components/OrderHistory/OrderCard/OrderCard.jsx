import React from "react";
import { getStatusText } from "../../../../../utils/orderStatus";
import './_order-card.scss';

const OrderCard = ({ order }) => {

    const { display_id: displayId, status, items, pickup_time: pickUpTime, total_price: totalPrice } = order;

    return (
        <div className='order-card'>
                        <div className='order-card__top'>
                            <span className="order-card__id">{displayId}</span>
                            <span className={`order-card__status order-card__status--${status}`}>
                                {getStatusText(status)}
                            </span>
                        </div>

                        <div className='order-card__items'>
                            {items.map((item, i) => (
                                <span key={i} className='order-card__item'>
                                    {item.name} x {item.quantity}
                                </span>
                            ))}
                        </div>

                        <div className='order-card__bottom'>
                            <span className='order-card__time'>{pickUpTime.slice(0, 5)}</span>
                            <span className='order-card__total'>{totalPrice} ₽</span>
                        </div>
                    </div>
    );
};

export default React.memo(OrderCard);