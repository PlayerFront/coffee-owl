import React, { useState } from "react";
import Button from "../Button/Button";
import CloseIcon from "../CloseIcon/CloseIcon";
import './_issue-report.scss';

const ISSUE_TYPES = [
    'Не открывается приложение',
    'Ошибка при заказе',
    'Проблемы с оплатой',
    'Не приходит СМС код',
    'Не могу войти в приложение',
    'Проблема с товаром',
    'Другое'
];

const IssueReport = ({ onClose, userPhone = '' }) => {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const subject = encodeURIComponent(`Проблема работы приложения Coffee owl: ${type}`); 
        const body = encodeURIComponent(
            `Тип проблемы: ${type}\n` +
            `Описание: ${description}\n` +
            `Контакт для связи: ${contact || 'не указан'}\n` +
            // `Пользователь: ${userPhone || 'не авторизован'}\n` +
            `Страница: ${window.location.pathname}\n` +
            `Дата: ${new Date().toLocaleString('ru-Ru')}`
        );

        window.location.href = `mailto:support@coffee-owl.ru?subject=${subject}&body=${body}`; 

        onClose();
    };

    return (
        <section className='issue-report'>
            <div className='issue-report-overlay' onClick={onClose}>
                <div className='issue-report-modal' onClick={(e) => e.stopPropagation()}>
                    <button className='issue-report__close' onClick={onClose} aria-label='закрыть'>
                        <CloseIcon />
                    </button>
                    <h2 className='issue-report__title'>
                        Сообщить о проблеме
                    </h2>
                    <form onSubmit={handleSubmit} className='issue-report__form'>
                    <div className='issue-report__field'>
                        <label htmlFor='issue-type'>Тип проблемы</label>
                        <select
                            id='issue-type'
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className='issue-report__select'
                        >
                            <option value=''>Выберите...</option>
                            {ISSUE_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div className='issue-report__field'>
                        <label htmlFor='issue-description'>
                            Описание проблемы
                        </label>
                        <textarea
                            id='issue-description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Опишите подробнее проблему'
                            rows={4}
                            required
                            className='issue-report__textarea'
                        >
                        </textarea>
                    </div>
                    <div className='issue-report__field'>
                        <label htmlFor='issue-contact'>
                            Как с вами связаться?
                        </label>
                        <input
                            id='issue-contact'
                            type='text'
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder='Телефон или email'
                            className='issue-report__input'
                        >
                        </input>
                    </div>
                    <div className='issue-report__actions'>
                        <Button
                            type='submit'
                            variant='primary'
                            size='small'
                            disabled={!type || !description}
                        >
                            Открыть почту и отправить
                        </Button>
                        <Button
                            type='button'
                            variant='secondary'
                            onClick={onClose}
                            size='small'
                        >
                            Отмена
                        </Button>
                    </div>
                </form>

                <div className='issue-report__note'>
                    <small>
                        Письмо отправится на support@coffee-owl.ru
                        <br />
                        Мы ответим вам в ближайшее время
                    </small>
                </div>
                </div>
            </div>
        </section>
    );
};

export default IssueReport;