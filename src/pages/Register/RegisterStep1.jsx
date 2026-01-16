import React, { useState } from "react";
import './_register-step1.scss';
import Button from "../../components/Button/Button";

const RegisterStep1 = ({ onNavigate }) => {
    const handleClickBack = () => {
        onNavigate('start');
    }

    return (
        <section className='register register--step1' id='register--step1'>
            {/* <Button
                variant='secondary'
                size='small'
                onClick={handleClickBack}
            >
                ←
            </Button>  Кнопка для разработки */}


            <div className='register__container'>
                <h1 className="register__title">Регистрация</h1>
                <form className='register__form'>
                    <div className='register__field'>
                        <label htmlFor='username' className='register__label'>Ваше имя *</label>
                        <input id='username' type='name' className='register__input'></input>
                    </div>
                    <div className='register__field'>
                        <label htmlFor='phonenumber' className='register__label'>Ваш телефон *</label>
                        <input id='phonenumber' type='tel' inputmode='numeric' className='register__input'>
                        </input>
                    </div>
                    <div className='register__field'>
                        <label htmlFor='email' className='register__label'>Ваша электронная почта *</label>
                        <input id='email' type='email' className='register__input'></input>
                    </div>
                </form>
            </div>

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