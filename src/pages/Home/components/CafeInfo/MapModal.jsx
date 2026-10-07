import React from "react";
import './_cafe-info.scss';
import CloseIcon from "../../../../components/CloseIcon/CloseIcon";
import YandexMap from "../../../../components/YandexMap/YandexMap";

const MapModal = ({ onClose }) => {
    return (
        <div className="map-modal" onClick={onClose}>
            <div className="map-modal__content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="map-modal__close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    <CloseIcon />
                </button>
                <div className="map-modal__info">
                    <h2 className="map-modal__title">Coffee Owl</h2>
                    <p className="map-modal__description">Мы находимся здесь</p>
                </div>
                <YandexMap />
            </div>
        </div>
    );
};

export default MapModal;