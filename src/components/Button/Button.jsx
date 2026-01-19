import React from "react";
import './_button.scss';

const Button = ({
    children,
    variant, // primary and secondary
    size, // large for start and registration, small for basket
    onClick,
    disabled = false,
    type='button',
    ...props // здесь нужно состояние disabled/ оказывается это стиль для неактивной кнопки в макете
}) => {
    return (
        <button
            type={type}
            className={`button button--${variant} button--${size} ${disabled ? 'button--disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}

            {...props}
        >
            {children}
        </button>
    );
};

export default Button;