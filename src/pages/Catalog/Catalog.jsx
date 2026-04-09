import React, { useState } from "react";
import { Products } from "./mockData";
import CatalogFilters from "./components/CatalogFilters/CatalogFilters";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import useCart from "../../utils/useCart";
import './_catalog.scss';

const Catalog = () => {

    const [activeFilter, setActiveFilter] = useState('all');
    const { getQuantity, addToCart, removeFromCart } = useCart();

    const filteredProducts = activeFilter === 'all'
        ? Products
        : Products.filter(p => p.category === activeFilter);

        
    return (
        <section className='catalog'>
            <CatalogFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
            <ProductGrid
                products={filteredProducts}
                getQuantity={getQuantity}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
            />
        </section>
    )
}

export default Catalog;