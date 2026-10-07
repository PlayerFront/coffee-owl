import React from 'react';
import './_home.scss';
// import useCart from '../../utils/useCart';
import { useCartContext } from '../../context/CartContext';
import SearchBar from './components/SearchBar/SearchBar';
import ComboCarousel from './components/ComboCarousel/ComboCarousel';
import SeasonalCarousel from './components/SeasonalCarousel/SeasonalCarousel';
import CoffeeLoad from './components/CoffeeLoad/CoffeeLoad';
import LocationIcon from '../../components/LocationIcon/LocationIcon';
import CafeInfo from './components/CafeInfo/CafeInfo';



const Home = ({ onTabChange }) => {
    const { addToCart, getQuantity, removeFromCart } = useCartContext();

    return (
        <section className='home'>
            <SearchBar 
                onSelectProduct={() => onTabChange('catalog', { filter: 'all' })}
                onAddToCart={addToCart}
                getQuantity={getQuantity}
            />
            <CafeInfo />
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