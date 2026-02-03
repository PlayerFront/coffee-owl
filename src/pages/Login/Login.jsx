import React, { useState } from "react";
import './_login.scss';
import { useForm } from "react-hook-form";
import { loginUser } from "../../api/authApi";
import Button from "../../components/Button/Button";
import AcceptIcon from "../../components/AcceptIcon/AcceptIcon";
import PolicyModal from "../../components/PolicyModal/PolicyModal";

const Login = ({ onNavigate, onPhoneSubmit }) => {

    const handleClickBack = () => {
        onNavigate('start');
    } // кнопка для верстки

    const [isLoading, setIsLoading] = useState(false); // для кнопки загрузки
    const [error, setError] = useState(null); // для показа ошибок
    const [showPolicyModal, setShowPolicyModal] = useState(false); // политика конфиденциальности

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            phone: "",
        }
    });

    const watchPhone = watch('phone');
    const isPhoneFilled = watchPhone?.trim()?.length > 0;

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            const cleanPhone = data.phone.replace(/\D/g, '');
            const formattedPhone = cleanPhone.startsWith('7')
                ? `+${cleanPhone}`
                : `+7${cleanPhone}`;

            console.log('Провреряем пользователя в базе', formattedPhone);

            const result = await loginUser(formattedPhone);
            console.log("Успех", result); // отладка

            if (onPhoneSubmit) {
                onPhoneSubmit(formattedPhone)
            }
        } catch (error) {
            console.error("Ошибка проверки пользователя", error);
            setError(error.message || "Ошибка при входе");
        } finally {
            setIsLoading(false);
        }
    }

    console.log("Form errors:", errors);
    console.log("Form validity:", isValid); // ДЛЯ ОТЛАДКИ

    return (
        <section className='login' id='login'>
            <div className='login__container'>
                {/* <button 
                    type="button"
                    className="login__back"
                    onClick={handleClickBack}
                >
                    Назад
                </button> */}
                <h1 className='login__title'>Вход</h1>
                <form className='login__form'>
                    <div className='login__field'>
                        <label htmlFor='phone' className='login__label'>Введите номер телефона, указанный при регистрации *</label>
                        <div className='login__input-wrapper'>
                            <input
                                id='phone'
                                type='tel'
                                inputMode='numeric'
                                className={`login__input ${errors.name ? 'login__input--error' : ''}`}
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
                            {!errors.phone && isPhoneFilled && (
                                <div className='login__icon-success'>
                                    <AcceptIcon />
                                </div>
                            )}
                        </div>
                        {errors.phone && (
                            <span className='login__error'>
                                {errors.phone.message}
                            </span>
                        )}
                        {error && (
                            <div className="login__error-message">
                                {error}
                            </div>
                        )}
                    </div>
                </form>
            </div>
            <div className='register__buttons'>
                <p className='register__agreement'>
                    Нажимая кнопку, вы соглашаетесь с {' '}
                    <button
                        type="button"
                        className="register__policy-link"
                        onClick={() => setShowPolicyModal(true)}
                    >
                        политикой конфиденциальности
                    </button>
                </p>
                {showPolicyModal && (
                    <PolicyModal onClose={() => setShowPolicyModal(false)} />
                )}

                <Button
                    variant='primary'
                    size='large'
                    type='submit'
                    disabled={!isValid || isLoading || !isPhoneFilled}
                    onClick={handleSubmit(onSubmit)}
                >
                    {isLoading ? 'Отправка...' : 'Отправить код'}
                </Button>
            </div>

        </section>
    );
};

export default Login;
