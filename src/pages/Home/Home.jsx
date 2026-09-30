import React from 'react';
import './_home.scss';
import useCart from '../../utils/useCart';
import ComboCarousel from './components/ComboCarousel/ComboCarousel';
import SeasonalCarousel from './components/SeasonalCarousel/SeasonalCarousel';
import CoffeeLoad from './components/CoffeeLoad/CoffeeLoad';


const Home = ({ onTabChange }) => {
    const { addToCart, getQuantity, removeFromCart } = useCart();

    return (
       <section className='home'>
            <ComboCarousel onComboClick={(filter) => onTabChange('catalog', { filter })} />
            <SeasonalCarousel 
                onSeasonalClick={() => onTabChange('catalog', { filter: 'seasonal' })}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                getQuantity={getQuantity}
            />
            <CoffeeLoad />
       </section>
    );
};

export default Home;