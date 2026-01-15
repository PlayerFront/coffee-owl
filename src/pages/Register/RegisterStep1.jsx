import React, { useState } from "react";
import './_register-step1.scss';
import Button from "../../components/Button/Button";

const RegisterStep1 = ({ onNavigate }) => {
    const handleClickBack = () => {
        onNavigate('start');
    }

    return (
        <section className='register' id='register'>
            <Button
                variant='secondary'
                size='small'
                onClick={handleClickBack}
            >
                ←
            </Button> {/*  Кнопка для разработки */}
            <h1 className="register__title">Регистрация</h1>
            <label htmlFor='username' className='register__label'>Ваше имя *</label>
            <input id='username' type='name'className='register__input'></input>
            <label htmlFor='phonenumber' className='register__label'>Ваш телефон *</label>
            <input id='phonenumber' type='number' className='register__input'></input>
            <label htmlFor='email' className='register__label'>Ваша электронная почта *</label>
            <input id='email' type='email' className='register__input'></input>
            <Button
                variant='primary'
                size='large'
                // onClick = отправка формы на сервер
                // состояние disabled, если в форме есть ошибки или она не заполнена
            >
                Отправить код
            </Button>
        </section>
    );
};

export default RegisterStep1;