import React from "react";
import './_install-guide-modal.scss';
import CloseIcon from '../../../../components/CloseIcon/CloseIcon';

const InstallGuideModal = ({ onClose }) => {
    return (
        <div className="install-guide" onClick={onClose}>
            <div className="install-guide__content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="install-guide__close"
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    <CloseIcon />
                </button>
                <h2 className="install-guide__title">Как установить приложение для iOS</h2>

                <ol className="install-guide__steps">
                    <li className="install-guide__step">
                        Нажмите кнопку "Поделиться" внизу экрана
                    </li>
                    <li className="install-guide__step">
                        Выберите "На экран домой"
                    </li>
                    <li className="install-guide__step">
                        Нажмите "Добавить"
                    </li>
                </ol>

                <p className="install-guide__note">
                    Иконка Coffee Owl появится на вашем рабочем столе
                </p>
            </div>
        </div>
    );
};

export default InstallGuideModal;