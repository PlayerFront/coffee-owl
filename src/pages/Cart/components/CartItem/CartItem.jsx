import React from "react";
import MinusIcon from "../../../../components/MinusIcon/MinusIcon";
import PlusIcon from "../../../../components/PlusIcon/PlusIcon";
import './_cart-item.scss';

const CartItem = ({ product, quantity, onAdd, onRemove }) => {
    return (
        <div className="cart-item">
            <img src={product.image} alt={product.name} className='cart-item__image' />

            <div className='cart-item__info'>
                <h3 className='cart-item__name'>{product.name}</h3>
                <p className='cart-item__volume'>{product.volume}</p>
                <div className='cart-item__controls'>
                    <button className='cart-item__control-btn' onClick={onRemove}>
                        <MinusIcon
                            color="#3D220D"
                        />
                    </button>
                    <span className='cart-item__quantity'>{quantity}</span>
                    <button className='cart-item__control-btn' onClick={onAdd}>
                        <PlusIcon
                            color="#3D220D"
                        />
                    </button>
                </div>
            </div>

            <div className='cart-item__price'>
                {product.price * quantity} ₽
            </div>
        </div>
    );
};

export default CartItem;