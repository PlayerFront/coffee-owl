import React from "react";
import './_search-bar.scss';

const SearchResultItem = ({ product, onClick, onAddToCart, quantity }) => {
    return (
        <div className="search-result" onClick={onClick}>
            <img
                src={product.image}
                alt={product.name}
                className="search-result__image"
            />
            <div className="search-result__info">
                <span className="search-result__name">{product.name}</span>
                <span className="search-result__price">{product.price} ₽</span>
            </div>
            <button
                className="search-result__add"
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                }}
            >
                {quantity > 0 ? `(${quantity})` : '+'}
            </button>
        </div>
    );
};

export default SearchResultItem;