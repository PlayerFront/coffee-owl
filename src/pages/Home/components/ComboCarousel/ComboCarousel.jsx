import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import './_combo-carousel.scss';
import ComboIcon from "../../../../components/ComboIcon/ComboIcon";
import Combo1 from '../../../../assets/images/HomePage/Combo1.webp';
import Combo2 from '../../../../assets/images/HomePage/Combo2.webp';
import Combo3 from '../../../../assets/images/HomePage/Combo3.webp';


const combos = [Combo1, Combo2, Combo3];

const ComboCarousel = ({ onComboClick }) => {
    return (
        <section className="combo-carousel">
            <header className="combo-carousel__header">
                <ComboIcon />
                <h2 className="combo-carousel__title">Выгодные комбо</h2>
            </header>

            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={12}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                className="combo-carousel__swiper"
            >
                {combos.map((image, index) => (
                    <SwiperSlide key={index} onClick={() => onComboClick?.('combo')}>
                        <img
                            src={image}
                            alt={`Комбо ${index + 1}`}
                            className="combo-carousel__image"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default ComboCarousel;