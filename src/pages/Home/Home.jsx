import React from 'react';
import './_home.scss';
import ComboCarousel from './components/ComboCarousel/ComboCarousel';
import SeasonalCarousel from './components/SeasonalCarousel/SeasonalCarousel';
import useCart from '../../utils/useCart';

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
       </section>
    );
};

export default Home;