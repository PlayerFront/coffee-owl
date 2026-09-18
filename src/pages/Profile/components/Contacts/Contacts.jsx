import React from "react";
import './_contacts.scss';
import Button from "../../../../components/Button/Button";
import LocationIcon from '../../../../components/LocationIcon/LocationIcon';
import ClockIcon from '../../../../components/ClockIcon/ClockIcon';
import YandexMap from '../../../../components/YandexMap/YandexMap';
import ContactsIcon from '../../../../components/ContactsIcon/ContactsIcon';

const Contacts = ({ onBack }) => {
    return (
        <section className="contacts">
            <header className="contacts__header">
                <ContactsIcon />
                <h2>Контакты</h2>
            </header>

            <ul className="contacts__list">
                <li className="contacts__item">
                    <div className="contacts__row">
                        <LocationIcon />
                        <span className="contacts__label">Адрес</span>
                    </div>
                    <span className="contacts__value">ул. Пушкина, д. 10</span>
                </li>


                <li className="contacts__item">
                    <div className="contacts__row">
                        <ClockIcon />
                        <span className="contacts__label">Часы работы</span>
                    </div>
                    <span className="contacts__value">Ежедневно с 9:00 до 22:00</span>
                </li>

                <li className="contacts__item">
                    <div className="contacts__row">
                        <ContactsIcon />
                        <span className="contacts__label">Адрес электронной почты</span>
                    </div>
                    <a className="contacts__value" href="mailto:support@coffee-owl.ru">support@coffee-owl.ru</a>
                </li>
            </ul>

            <div className="contacts__map">
                <YandexMap />
            </div>

            <div className='contacts__footer'>
                <Button
                    size='large'
                    variant='secondary'
                    onClick={onBack}
                >
                    Назад</Button>
            </div>
        </section>
    )
};

export default Contacts;