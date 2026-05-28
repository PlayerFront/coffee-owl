import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import OrderHistory from "./OrderHistory";
import { useUserOrders } from "../../../../hooks/useOrders";

jest.mock('../../../../hooks/useOrders', () => ({
    useUserOrders: jest.fn(),
}));

describe('OrderHistory', () => {
    const mockOnBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Показывается загрузка пока данные не пришли', () => {
        useUserOrders.mockReturnValue({
            orders: [],
            loading: true,
            error: null,
        });

        render(<OrderHistory onBack={mockOnBack} />);
        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

    test('Показывается сообщение когда заказов нет', () => {
        useUserOrders.mockReturnValue({
            orders: [],
            loading: false,
            error: null,
        });

        render(<OrderHistory onBack={mockOnBack} />);
        expect(screen.getByText('У вас пока нет заказов')).toBeInTheDocument();
    });

    test('Отображается ошибка, если она есть', () => {
        useUserOrders.mockReturnValue({
            orders: [],
            loading: false,
            error: 'Ошибка загрузки заказов',
        });

        render(<OrderHistory onBack={mockOnBack} />);
        expect(screen.getByText('Ошибка загрузки заказов')).toBeInTheDocument();
    });

    test('Отображается список заказов', () => {
        useUserOrders.mockReturnValue({
            orders: [
                {
                    id: '1',
                    display_id: 'CWL-06482',
                    status: 'pending',
                    items: [
                        { name: 'Капучино', quantity: 2 },
                        { name: 'Круассан', quantity: 1 },
                    ],
                    total_price: 370,
                    pickup_time: '09:30:00',
                },
                {
                    id: '2',
                    display_id: 'CWL-06483',
                    status: 'ready',
                    items: [
                        { name: 'Латте', quantity: 1 },
                    ],
                    total_price: 220,
                    pickup_time: '14:00:00',
                },
            ],
            loading: false,
            error: null,
        });

        render(<OrderHistory onBack={mockOnBack} />);

        expect(screen.getByText('Мои заказы')).toBeInTheDocument();
        expect(screen.getByText('CWL-06482')).toBeInTheDocument();
        expect(screen.getByText('CWL-06483')).toBeInTheDocument();
        expect(screen.getByText('В обработке')).toBeInTheDocument();
        expect(screen.getByText('Готов')).toBeInTheDocument();
    });

    test('Кнопка Назад вызывает onBack', () => {
        useUserOrders.mockReturnValue({
            orders: [],
            loading: false,
            error: null,
        });

        render(<OrderHistory onBack={mockOnBack} />);
        fireEvent.click(screen.getByText('Назад'));
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    test('Отображается итоговая сумма для каждого заказа', () => {
        useUserOrders.mockReturnValue({
            orders: [
                {
                    id: '1',
                    display_id: 'CWL-06482',
                    status: 'pending',
                    items: [
                        { name: 'Капучино', quantity: 2 },
                        { name: 'Круассан', quantity: 1 },
                    ],
                    total_price: 370,
                    pickup_time: '09:30:00',
                }
            ],
            loading: false,
            error: null,
        });

        render(<OrderHistory onBack={mockOnBack} />);
        expect(screen.getByText('370 ₽')).toBeInTheDocument();
    });
})
