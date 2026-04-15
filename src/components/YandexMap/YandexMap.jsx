import React, { useEffect, useRef } from "react";
import './_yandex-map.scss';

const YandexMap = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (window.ymaps && !mapInstanceRef.current) {
            initMap();
        } else if (!window.ymaps) {
            const checkYmaps = setInterval(() => {
                if (window.ymaps) {
                    clearInterval(checkYmaps);
                    initMap();
                }
            }, 100);
        }

        function initMap() {
            window.ymaps.ready(() => {
                mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
                    center: [55.7558, 37.6176],
                    zoom: 14,
                    controls: ['zoomControl', 'fullscreenControl']
                });

                const placemark = new window.ymaps.Placemark(
                    [55.7558, 37.6176],
                    {
                        hintContent: 'Coffee Owl',
                        baloonContent: 'ул. Пушкина, д. 10'
                    },
                    {
                        iconLayout: 'default#imageWithContent',
                        iconImageHref: '/logo.webp',
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -15],
                    }
                );

                mapInstanceRef.current.geoObjects.add(placemark);
            });
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return <div ref={mapRef} className='yandex-map'>

    </div>
};

export default YandexMap;
