import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import './_seasonal-carousel.scss';

import { Products } from '../../../Catalog/mockData';
import SeasonalCard from "./SeasonalCard";

const SeasonalCarousel = ({ onSeasonalClick, onAddToCart, onRemoveFromCart, getQuantity }) => {
    const seasonalProducts = Products.filter(p => p.category === 'seasonal');

    return (
        <section className="seasonal-carousel">
            <header className="seasonal-carousel__header">
                <h2 className="seasonal-carousel__title">Хиты сезона</h2>
            </header>

            <Swiper
                modules={[Pagination]}
                spaceBetween={12}
                slidesPerView={2.2}
                loop={true}
                pagination={{ clickable: true }}
                className="seasonal-carousel__swiper"
            >
                {seasonalProducts.map((item) => (
                    <SwiperSlide key={item.id}>
                        <SeasonalCard
                            item={item}
                            quantity={getQuantity(item.id)}
                            onClick={() => onSeasonalClick?.(item)}
                            onAddToCart={() => onAddToCart(item.id)}
                            onRemove={() => onRemoveFromCart(item.id)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default SeasonalCarousel;