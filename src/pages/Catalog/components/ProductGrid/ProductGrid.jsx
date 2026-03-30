import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import './_product-grid.scss';

const ProductGrid = ({ products, getQuantity, onAddToCart, onRemoveFromCart }) => {
    return (
        <div className='product__grid'>
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getQuantity(product.id)}
                    onAdd={() => onAddToCart(product.id)}
                    onRemove={() => onRemoveFromCart(product.id)}
                />
            ))}
        </div>
    );
};

export default ProductGrid;