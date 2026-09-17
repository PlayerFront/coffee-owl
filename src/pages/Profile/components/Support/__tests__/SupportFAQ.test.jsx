import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import SupportFAQ from "../SupportFAQ/SupportFAQ";


jest.mock('../../../../../components/CoffeeBeanIcon/CoffeeBeanIcon', () => () => <span>Иконка кофейного зерна</span>);

describe('SupportFAQ component', () => {
    const mockOnBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится заголовок Частые вопросы', () => {
        render(<SupportFAQ onBack={mockOnBack} />);
        expect(screen.getByText('Частые вопросы')).toBeInTheDocument();
    });

    test('Рендерится весь список вопросов', () => {
        render(<SupportFAQ onBack={mockOnBack} />);
        expect(screen.getByText('Как сделать заказ?')).toBeInTheDocument();
        expect(screen.getByText('Где забрать заказ?')).toBeInTheDocument();
        expect(screen.getByText('Можно ли отменить заказ?')).toBeInTheDocument();
        expect(screen.getByText('Как получить скидку в день рождения?')).toBeInTheDocument();
    });

    test('Ответы на вопросы скрыты по умолчанию', () => {
        render(<SupportFAQ onBack={mockOnBack} />);
        expect(screen.queryByText(/Выберите товары в каталоге/)).not.toBeInTheDocument();
    });

    test('Клик на вопрос открывает ответ', () => {
        render(<SupportFAQ onBack={mockOnBack} />);
        fireEvent.click(screen.getByText('Как сделать заказ?'));
        expect(screen.getByText(/Выберите товары в каталоге/)).toBeInTheDocument(); // разница между кавычками и /   /
    });

    test('Повторный клик на вопрос закрывает ответ', () => {
        render(<SupportFAQ onBack={mockOnBack} />);
        const question = screen.getByText('Как сделать заказ?');

        fireEvent.click(question);
        expect(screen.getByText(/Выберите товары в каталоге/)).toBeInTheDocument();

        fireEvent.click(question);
        expect(screen.queryByText(/Выберите товары в каталоге/)).not.toBeInTheDocument();
    });

    test('Открытие нового вопроса закрывает предыдущий ответ', () => {
        render(<SupportFAQ onBack={mockOnBack} />);

        fireEvent.click(screen.getByText('Как сделать заказ?'));
        expect(screen.getByText(/Выберите товары в каталоге/)).toBeInTheDocument();

        fireEvent.click(screen.getByText('Где забрать заказ?'));
        expect(screen.queryByText(/Выберите товары в каталоге/)).not.toBeInTheDocument();

        expect(screen.getByText(/Заказ можно забрать/)).toBeInTheDocument();
    });

    test('Кнопка Назад вызывает onBack', () => {
        render(<SupportFAQ onBack={mockOnBack} />);

        fireEvent.click(screen.getByText('Назад'));
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
});