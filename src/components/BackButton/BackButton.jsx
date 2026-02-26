import React from "react";
import Button from '../Button/Button';

const BackButton = ({
    onNavigate,
    fallbackpage = 'start',
    className = '',
    children = 'Назад',
    size = 'large',
    variant = 'secondary',
    ...props
}) => {
    const handleGoBack = () => {
        onNavigate(fallbackpage);
    }

    return (
        <Button
            size={size}
            onClick={handleGoBack}
            className={`button button--${variant} button--${size} : ''}`}
            variant={variant}
            {...props}
        >
            {children}
        </Button>
    )
};

export default BackButton;