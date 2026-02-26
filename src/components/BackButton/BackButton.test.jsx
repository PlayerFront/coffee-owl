import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from "./BackButton";

jest.mock('../Button/_button.scss');

jest.mock('../Button/Button', () => ({
    __esModule: true,
    default: ({ children, onClick, variant, size, type = 'button', ...props }) => (
        <button
            type={type}
            onClick={onClick}
            data-testid={`mock-button-${variant || 'default'}`}
            data-size={size}
            {...props}
        >
            {children}
        </button>
    )
}));

describe('BackButton component', () => {
    const mockOnNavigate = jest.fn();
    const defaultProps = {
        onNavigate: mockOnNavigate,
        fallbackpage: 'start',
        children: 'Назад',
        size: 'large',
        variant: 'secondary'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендериться кнопка с корректным текстом', () => {
        render(<BackButton {...defaultProps} />);

        const button = screen.getByRole('button', { name: /назад/i });
        expect(button).toBeInTheDocument();
    }); //успех

    test('Рендерится кнопка с кастомным текстом', () => {
        render(<BackButton {...defaultProps}>Вернуться в каталог</BackButton>);

        const button = screen.getByRole('button', { name: /вернуться в каталог/i });
        expect(button).toBeInTheDocument();
    });  //успех

    test('Передаются правильные пропсы в компонент Button', () => {
        render(
            <BackButton
                {...defaultProps}
                size="small"
                variant="primary"
                className="custom-class"
            />
        );


        const button = screen.getByTestId('mock-button-primary');
        expect(button).toHaveAttribute('data-size', 'small');
        expect(button).toHaveClass('button button--primary button--small');
    }); //успех

    test('Вызывается onNavigate с fallbackpage при клике', () => {
        render(<BackButton {...defaultProps} fallbackpage="catalog" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnNavigate).toHaveBeenCalledTimes(1);
        expect(mockOnNavigate).toHaveBeenCalledWith('catalog');
    }); //успех 

    test('Используется fallbackpage="start" по умолчанию', () => {
        render(<BackButton onNavigate={mockOnNavigate} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnNavigate).toHaveBeenCalledWith('start');
    }); //успех

    test('Передаются дополнительные пропсы в Button', () => {
        render(
            <BackButton
                {...defaultProps}
                disabled={true}
                data-testid="custom-back-button"
            />
        );

        const button = screen.getByTestId('custom-back-button');
        expect(button).toBeDisabled();
    });//успех
})