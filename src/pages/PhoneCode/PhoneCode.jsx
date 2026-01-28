import React, { useState, useRef, useEffect } from "react";
import './_phone-code.scss';
import Button from "../../components/Button/Button";
import { verifyCode, resendCode } from '../../api/authApi';

const PhoneCode = ({
    phone,
    onCodeSubmit,
    onResendCode
}) => {
    const [code, setCode] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    const maskedPhone = phone
        ? `+7 *** ***-**-${phone.slice(-2)}`
        : '';

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(0, 1);
        setCode(newCode);
        setError('');

        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }

        if (newCode.every(digit => digit !== '') && index === 3) {
            handleSubmit(newCode.join(''));
        } // нужный АВТОсабмит, если пользователь ввел все цифры
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs[index - 1].current.focus();
        }

        if (e.key === 'ArrowRight' && index < 3) {
            inputRefs[index + 1].current.focus(); // нужные нам стрелки для навигации
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (/^\d{4}$/.test(pastedData)) {
            const digits = pastedData.split('');
            const newCode = [...code];

            digits.forEach((digit, index) => {
                if (index < 4) {
                    newCode[index] = digit;
                }
            });

            setCode(newCode);

            const lastIndex = Math.min(3, digits.length - 1);
            inputRefs[lastIndex].current.focus();

            if (digits.length === 4) {
                setTimeout(() => handleSubmit(pastedData), 100);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        inputRefs[0].current.focus();
    }, []);

    const handleSubmit = async (fullCode) => {
        if (fullCode.length !== 4 || !/^\d{4}$/.test(fullCode)) {
            setError('Введите 4 цифры кода');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            // const result = await verifyCode(phone, fullCode);
            // console.log('Успешная регистрация', result.user);

            if (onCodeSubmit) {
                await onCodeSubmit(fullCode);
            }
        } catch (error) {
            console.error('Ошибка проверки кода', error)
            setError('Неверный код. Попробуйте еще раз');
            setCode(['', '', '', '']);
            inputRefs[0].current.focus();
            // throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        try {
            setIsLoading(true);
            setError('');

            const result = await resendCode(phone);
            console.log('Новый код:', result.code);
            
            if (onResendCode) {
                await onResendCode();
                setTimer(60);
                setCode(['', '', '', '']);
                inputRefs[0].current.focus();
            }
        } catch (err) {
            setError('Не удалось отправить код. Попробуйте позже');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className='phone-code'>
            <div className='phone-code__container'>
                <h1 className='phone-code__title'>
                    Вам отправлен код подтверждения
                </h1>
                <div className='phone-code__code'>
                    <p className='phone-code__description'>На номер <span className='phone-code__number'>{maskedPhone}+7XXXXXXXX</span></p>
                    <div className='phone-code__inputs'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type='text'
                                inputMode="numeric"
                                pattern="[0-9}*"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className={`phone-code__input ${error ? 'phone-code__input--error' : ''}`}
                                disabled={isLoading}
                                aria-label={`Вводится ${index + 1} цифра из четырехзначного кода`}
                            />
                        ))}
                    </div>
                    {error && (
                        <p className='phone-code__error'>{error}</p>
                    )}
                </div>
            </div>
            <div className='phone-code__buttons'>
                <div className='phone-code__resend'>
                    {timer > 0 ? (
                        <span className='phone-code__timer'>
                            Отправить код повторно через 00:
                            {timer < 10 ? `0${timer}` : timer}
                        </span>
                    ) : (
                        <Button
                            variant='secondary'
                            size='large'
                            onClick={handleResend}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Отправка...' : 'Отправить код повторно'}
                        </Button>
                    )}
                </div>
                <Button
                    variant='primary'
                    size='large'
                    onClick={() => handleSubmit(code.join(''))}
                    disabled={isLoading || code.some(digit => digit === '')}
                >
                    {isLoading ? 'Проверка' : 'Подтвердить'}
                </Button>
            </div>
        </section>
    )
}

export default PhoneCode;