import React, { useState } from "react";
import Button from "../../../../../components/Button/Button";
import './_supportFAQ.scss';
import CoffeeBeanIcon from "../../../../../components/CoffeeBeanIcon/CoffeeBeanIcon";


const SupportFAQ = ({ onBack }) => {

    const [openIndex, setOpenIndex] = useState(null);

    const faqItems = [
        {
            question: 'Как сделать заказ?',
            answer: 'Выберите товары в каталоге, добавьте их в корзину, а затем нажмите кнопку "Оформить заказ".',
        },
        {
            question: 'Где забрать заказ?',
            answer: 'Заказ можно забрать в кофейне по адресу: ул.Пушкина, д.10. Мы работаем ежедневно с 9:00 до 22:00.',
        },
        {
            question: 'Можно ли отменить заказ?',
            answer: 'Заказ можно отменить до того, как он передан в приготовление, позвонив в кофейню. Статус заказа можно посмотреть в Профиле, в разделе "Мои заказы".',
        },
        {
            question: 'Как получить скидку в день рождения?',
            answer: 'Зарегистрируйтесь в нашем приложении и укажите дату рождения в настройках профиля. Скидка расчитывается при оплате на кассе кофейни. Для ее получения необходим паспорт и номер телефона, к которому привязан ваш аккаунт',
        },
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="support">
            <div className="support__header">
                <h2>Частые вопросы</h2>
            </div>

            <div className="support__faq">
                {faqItems.map((item, index) => (
                    <div key={index} className="support__faq-item">
                        <button
                            className="support__faq-question"
                            onClick={() => toggleFaq(index)}
                        >
                            <span>{item.question}</span>
                            <span className="support__faq-icon">
                                {/* {openIndex === index ? '▲' : '▼'} */}
                                <CoffeeBeanIcon />
                            </span>
                        </button>
                        {openIndex === index && (
                            <p className="support__faq-answer">{item.answer}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className='support__footer'>
                <Button
                    size='large'
                    variant='secondary'
                    onClick={onBack}
                >
                    Назад</Button>
            </div>
        </section>
    );
};

export default SupportFAQ;