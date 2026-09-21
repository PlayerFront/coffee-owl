const React = require('react');

const Swiper = ({ children }) => React.createElement('div', { 'data-testid': 'swiper' }, children);
const SwiperSlide = ({ children, onClick }) => React.createElement('div', { 'data-testid': 'swiper-slide', onClick }, children);

module.exports = {
    Swiper,
    SwiperSlide
};