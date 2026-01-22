import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { registerUser } from "../../api/authApi";
import './_register-step1.scss';
import Button from "../../components/Button/Button";
import AcceptIcon from "../../components/AcceptIcon/AcceptIcon";

const RegisterStep1 = ({ onNavigate, onPhoneSubmit }) => {
    // const handleClickBack = () => {
    //     onNavigate('start');
    // } technical button

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        watch
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: "",
            phone: "",
            email: ""
        }
    });

    const watchAllFields = watch(['name', 'phone', 'email']);
    const allFieldsFilled = watchAllFields.every(field => field?.trim() !== '');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const cleanPhone = data.phone.replace(/\D/g, '');
            const formattedPhone = cleanPhone.startsWith('7')
                ? `+${cleanPhone}`
                : `+7${cleanPhone}`;

            const userData = {
                ...data,
                phone: formattedPhone
            }
            console.log("Отправляем данные на Supabase", userData);

            const result = await registerUser(userData);
            console.log("Успех", result);

            onPhoneSubmit(formattedPhone);
        } catch (error) {
            console.error("Ошибка при регистрации", error);
            setError(error.message || "Ошибка при отправке данных");
        } finally {
            setIsLoading(false);
        }
    };

    console.log("Form errors:", errors);
    console.log("Form validity:", isValid); // ДЛЯ ОТЛАДКИ

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
                        <input
                            id='username'
                            type='text'
                            className={`register__input ${errors.name ? 'register__input--error' : ''}`}
                            {...register("name", {
                                required: 'Имя обязательно',
                                minLength: {
                                    value: 2,
                                    message: 'Минимум 2 символа'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Максимум 50 символов'
                                },
                                pattern: {
                                    value: /^[А-Яа-яЁёA-Za-z]+(?:[-\s][А-Яа-яЁёA-Za-z]+)*$/,
                                    message: 'Только буквы, пробелы и дефисы'
                                }
                            })}
                        >
                        </input>
                        {!errors.name && watch('name')?.trim() && (
                            <div className='register__icon-success'>
                                <AcceptIcon />
                            </div>
                        )}
                        {errors.name && (
                            <span className='register__error'>{errors.name.message}</span>
                        )}
                    </div>
                    <div className='register__field'>
                        <label htmlFor='phone' className='register__label'>Ваш телефон *</label>
                        <input
                            id='phone'
                            type='tel'
                            inputMode='numeric'
                            className={`register__input ${errors.name ? 'register__input--error' : ''}`}
                            placeholder='+7'
                            {...register("phone", {
                                required: 'Телефон обязателен',
                                pattern: {
                                    value: /^\+7\s?\(?\d{3}\)?\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
                                    message: 'Формат +7 (XXX) XXX-XX-XX'
                                }
                            })}
                        >
                        </input>
                        {!errors.phone && watch('phone')?.trim() && (
                            <div className='register__icon-success'>
                                <AcceptIcon />
                            </div>
                        )}
                        {errors.phone && (
                            <span className='register__error'>{errors.phone.message}</span>
                        )}
                    </div>
                    <div className='register__field'>
                        <label htmlFor='email' className='register__label'>Ваша электронная почта *</label>
                        <input
                            id='email'
                            type='email'
                            className={`register__input ${errors.email ? 'register__input--error' : ''}`}
                            {...register("email", {
                                required: 'Эл. почта обязательна',
                                pattern: {
                                    value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                    message: 'Некорректный адрес эл. почты'
                                }
                            })}
                        >
                        </input>
                        {!errors.email && watch('email')?.trim() && (
                            <div className='register__icon-success'>
                                <AcceptIcon />
                            </div>
                        )}
                        {errors.email && (
                            <span className='register__error'>{errors.email.message}</span>
                        )}
                    </div>

                </form>
            </div>
{/* TODO: сделать подпись к кнопке, а может даже и чекбокс по политике конфиденциальности (в макете нет) */}
            <Button
                variant='primary'
                size='large'
                type='submit'
                disabled={!isValid || !allFieldsFilled || isLoading}
                        onClick={handleSubmit(onSubmit)}
            >
                {/* TODO: add Loading page */}
                {isLoading ? 'Отправка...' : 'Отправить код'}
            </Button>
        </section>
    );
};

export default RegisterStep1;