import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Contacts from "../Contacts";


jest.mock('../../../../../components/ContactsIcon/ContactsIcon', () => () => <span>Иконка контактов</span>);
jest.mock('../../../../../components/LocationIcon/LocationIcon', () => () => <span>Иконка локации</span>);
jest.mock('../../../../../components/ClockIcon/ClockIcon', () => () => <span>Иконка часов</span>);

jest.mock('../../../../../components/YandexMap/YandexMap', () => {
    return function MockMap() {
        return <div data-testid='yandex-map'>Карта</div>
    };
});

describe('Contacts element', () => {
    const mockOnBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится заголовок Контакты', () => {
        render(<Contacts onBack={mockOnBack} />);
        expect(screen.getByText('Контакты')).toBeInTheDocument();
    });

    test('Отображается адрес кофейни', () => {
        render(<Contacts onBack={mockOnBack} />);
        expect(screen.getByText('Адрес')).toBeInTheDocument();
        expect(screen.getByText('ул. Пушкина, д. 10')).toBeInTheDocument();
    });

    test('Отображаются часы работы кофейни', () => {
        render(<Contacts onBack={mockOnBack} />);
        expect(screen.getByText('Часы работы')).toBeInTheDocument();
        expect(screen.getByText('Ежедневно с 9:00 до 22:00')).toBeInTheDocument();
    });

    test('Отображается электронный адрес кофейни, почту можно кликнуть', () => {
        render(<Contacts onBack={mockOnBack} />);
        const emailLink = screen.getByText('support@coffee-owl.ru');
        expect(emailLink).toBeInTheDocument();
        expect(emailLink).toHaveAttribute('href', 'mailto:support@coffee-owl.ru');
    });

    test('Рендерится Якарта', () => {
        render(<Contacts onBack={mockOnBack} />);
        expect(screen.getByTestId('yandex-map')).toBeInTheDocument();
    });

    test('Кнопка Назад вызывает onBack', () => {
        render(<Contacts onBack={mockOnBack} />);
        fireEvent.click(screen.getByText('Назад'));
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    test('Список контактов содержит три элемента', () => {
        render(<Contacts onBack={mockOnBack} />);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
    });
});