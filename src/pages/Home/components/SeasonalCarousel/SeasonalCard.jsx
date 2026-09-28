import React from "react";
import './_seasonal-card.scss';
import Button from '../../../../components/Button/Button';
import CartIcon from "../../../../components/CartIcon/CartIcon";
import MinusIcon from "../../../../components/MinusIcon/MinusIcon";
import PlusIcon from "../../../../components/PlusIcon/PlusIcon";

const SeasonalCard = ({ item, onClick, onAddToCart, quantity, onRemove }) => {
    return (
        <div className="seasonal-card" >
            <div className="seasonal-card__clickable" onClick={onClick}>
                <img
                    src={item.image}
                    alt={item.name}
                    className="seasonal-card__image"
                />

                <div className="seasonal-card__info">
                    <h3 className="seasonal-card__name">{item.name}</h3>
                    <p className="seasonal-card__price">{item.price} ₽</p>
                </div>
            </div>

            <div className="seasonal-card__actions">
                {quantity === 0 ? (
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => onAddToCart?.(item.id)}
                    >
                        Заказать
                    </Button>
                ) : (
                    <div className="seasonal-card__quantity-control">
                        <span
                            className='seasonal-card__quantity-btn'
                            onClick={onRemove}
                        >
                            <MinusIcon />
                        </span>

                        <span
                            className='seasonal-card__quantity-cart'
                        >
                            <CartIcon />
                            ({quantity})
                        </span>


                        <span
                            className='seasonal-card__quantity-btn'
                            onClick={onAddToCart}
                        >
                            <PlusIcon />
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeasonalCard;