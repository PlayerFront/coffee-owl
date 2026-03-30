import React, { useState } from "react";
import Button from "../../../../components/Button/Button";
import CartIcon from "../../../../components/CartIcon/CartIcon";
import './_product-card.scss';
import MinusIcon from "../../../../components/MinusIcon/MinusIcon";
import PlusIcon from "../../../../components/PlusIcon/PlusIcon";

const ProductCard = ({ product, quantity, onAdd, onRemove }) => {
    // const handleAddToCart = () => onUpdate(product.id, 1);
    // const handleIncrease = () => onUpdate(product.id, quantity + 1);
    // const handleDecrease = () => onUpdate(product.id, quantity - 1);

    return (
        <div className='product-card'>
            <img src={product.image} alt={product.name} className='product-card__image' />
            <div className='product-card__description'>
                <h3 className='product-card__name'>{product.name}</h3>
                <p className='product-card__volume'>{product.volume}</p>
                <p className='product-card__price'>{product.price} ₽</p>
            </div>

            {quantity === 0 ? (
                <Button
                    variant='primary'
                    size='small'
                    onClick={onAdd}
                >
                    Заказать
                </Button>
            ) : (
                <div className='product-card__quantity-control'>
                    <span
                        className='product-card__quantity-btn'
                        onClick={onRemove}
                    >
                        <MinusIcon />
                    </span>

                    <span
                        className='product-card__quantity-cart'
                    >
                        <CartIcon />
                        ({quantity})
                    </span>


                    <span
                        className='product-card__quantity-btn'
                        onClick={onAdd}
                    >
                        <PlusIcon />
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProductCard;