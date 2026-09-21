import React from 'react';
import './_home.scss';
import ComboCarousel from './components/ComboCarousel/ComboCarousel';

const Home = ({ onTabChange }) => {
    return (
       <section className='home'>
            <ComboCarousel onComboClick={(filter) => onTabChange('catalog', { filter })} />
       </section>
    );
};

export default Home;