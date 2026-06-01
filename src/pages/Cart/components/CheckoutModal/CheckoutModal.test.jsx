import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import CheckOutModal from "./CheckoutModal";
import { getUserFromStorage } from "../../../../utils/authStorage";
import { formatTimeForDB, getAvailableTimes } from "../../../../utils/timeUtils";
import { createOrder } from "../../../../api/orderApi";

jest.mock('../../../../utils/authStorage', () => ({
    getUserFromStorage: jest.fn(() => ({ id: 10 })),
}));

jest.mock('../../../../api/orderApi', () => ({
    createOrder: jest.fn(),
}));

jest.mock('../../../../utils/timeUtils', () => ({
    getAvailableTimes: jest.fn(() => ['09:00', '09:30', '10:00']),
    formatTimeForDB: jest.fn((time) => `${time}:00`),
}));

jest.mock('../../../../components/YandexMap/YandexMap', () => {
    return function MockMap() {
        return <div data-testid='yandex-map'>Карта</div>
    };
});

jest.mock('../../../../components/LocationIcon/LocationIcon', () => () => <span>Иконка локации</span>);
jest.mock('../../../../components/WalletIcon/WalletIcon', () => () => <span>Иконка кошелька</span>);
jest.mock('../../../../components/PurchaseIcon/PurchaseIcon', () => () => <span>Иконка корзины</span>);
jest.mock('../../../../components/ClockIcon/ClockIcon', () => () => <span>Иконка времени</span>);
jest.mock('../../../../components/AcceptIcon/AcceptIcon', () => () => <span>Иконка подтверждения</span>);

const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    cartItems: [
        { id: 1, name: 'Капучино', price: 220 },
        { id: 2, name: 'Круассан', price: 150 },
    ],
    total: 370,
    getQuantity: jest.fn((id) => (id === 1 ? 2 : 1)),
    onTabChange: jest.fn(),
    onClearCart: jest.fn(),
};

describe('CheckoutModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится заголовок когда модальное окно открыто', () => {
        render(<CheckOutModal {...defaultProps} />);
        expect(screen.queryByText('Оформление заказа')).toBeInTheDocument();
    });

    test('Не рендерится ничего, когда модальное окно закрыто', () => {
        render(<CheckOutModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Оформление заказа')).not.toBeInTheDocument();
    });

    test('Показывается адрес кофейни', () => {
        render(<CheckOutModal {...defaultProps} />);
        expect(screen.getByText(/ул. Пушкина, д. 10/)).toBeInTheDocument();
    });

    test('Рендерится карта с местоположением кофейни', () => {
        render(<CheckOutModal {...defaultProps} />);
        expect(screen.getByTestId('yandex-map')).toBeInTheDocument();
    });

    test('Способ оплаты наличными выбран по умолчанию', () => {
        render(<CheckOutModal {...defaultProps} />);
        const cashRadio = screen.getByLabelText('Наличными');
        expect(cashRadio).toBeChecked();
    });

    test('Спасоб оплаты можно переключить на "картой" ', () => {
        render(<CheckOutModal {...defaultProps} />);
        const cardRadio = screen.getByLabelText('Картой');
        fireEvent.click(cardRadio);
        expect(cardRadio).toBeChecked();
    });

    test('Отображается селект выбора времени', () => {
        render(<CheckOutModal {...defaultProps} />);
        expect(screen.getByText('Выберите время')).toBeInTheDocument();
        expect(screen.getByText('09:00')).toBeInTheDocument;
        expect(screen.getByText('09:30')).toBeInTheDocument;
    });

    test('Кнопка Подтвердить заблокирована без выбора времени', () => {
        render(<CheckOutModal {...defaultProps} />);
        const button = screen.getByText('Подтвердить');
        expect(button).toBeDisabled();
    });

    test('Кнопка Подтвердить активна после выбора времени', () => {
        render(<CheckOutModal {...defaultProps} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '09:30' } });
        const button = screen.getByText('Подтвердить');
        expect(button).not.toBeDisabled();
    });

    test('Отображаются товары из корзины, отображается их стоимость и итоговая сумма', () => {
        render(<CheckOutModal {...defaultProps} />);
        expect(screen.getByText(/Капучино x 2/)).toBeInTheDocument();
        expect(screen.getByText(/Круассан x 1/)).toBeInTheDocument();
        expect(screen.getByText('440 ₽')).toBeInTheDocument();
        expect(screen.getByText('150 ₽')).toBeInTheDocument();
        expect(screen.getByText('370 ₽')).toBeInTheDocument();
    });

    test('Вызывается onclose при нажатии кнопки Вернуться к заказу', () => {
        render(<CheckOutModal {...defaultProps} />);
        const button = screen.getByText('Вернуться к заказу');
        fireEvent.click(button);
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
});

describe('Отправка заказа', () => {
    const selectTime = () => {
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '09:30' } });
    };

    test('Показывается экран успеха после успешного оформления заказа', async () => {
        createOrder.mockResolvedValue({
            id: '123',
            display_id: 'CWL-06482',
        });

        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        const submitButton = screen.getByText('Подтвердить');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Заказ оформлен!')).toBeInTheDocument();
        });

        expect(screen.getByText(/CWL-06482/)).toBeInTheDocument();
        expect(screen.getByText(/09:30/)).toBeInTheDocument();
    });

    test('Кнопка перейти к заказам вызывает onTabChange, initialView и onClose', async () => {
        createOrder.mockResolvedValue({
            id: '123',
            display_id: 'CWL-06482',
        });

        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        fireEvent.click(screen.getByText('Подтвердить'));

        await waitFor(() => {
            expect(screen.getByText('Заказ оформлен!')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Перейти к заказам'));

        expect(defaultProps.onClose).toHaveBeenCalled();
        expect(defaultProps.onTabChange).toHaveBeenCalledWith('profile',  { initialView: 'orders' });


    })

    test('Показывается ошибка при проблеме с отправкой', async () => {
        createOrder.mockRejectedValue(new Error('Не удалось оформить заказ'));
        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        const submitButton = screen.getByText('Подтвердить');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Не удалось оформить заказ/)).toBeInTheDocument();
        });
    });

    test('Кнопка показывает "Оформление..." во время отправки заказа', async () => {
        createOrder.mockRejectedValue(new Error('Не удалось оформить заказ'));

        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        const submitButton = screen.getByText('Подтвердить');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Оформление...')).toBeInTheDocument();
        })
    });

    test('Вызывает onClearCart после успешной отправки', async () => {
        createOrder.mockResolvedValue({
            id: '123',
            display_id: 'CWL-06482',
        });

        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        fireEvent.click(screen.getByText('Подтвердить'));

        await waitFor(() => {
            expect(defaultProps.onClearCart).toHaveBeenCalled();
        });
    });

    test('Кнопка Вернуться в каталог вызывает onTabChange и onClose', async () => {
        createOrder.mockResolvedValue({
            id: '123',
            display_id: 'CWL-06482',
        });

        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        fireEvent.click(screen.getByText('Подтвердить'));

        await waitFor(() => {
            expect(screen.getByText('Заказ оформлен!')).toBeInTheDocument();
        });

        const catalogButton = screen.getByText('Вернуться в каталог');
        fireEvent.click(catalogButton);

        expect(defaultProps.onClose).toHaveBeenCalled();
        expect(defaultProps.onTabChange).toHaveBeenCalledWith('catalog');
    });

    test('Создает заказ с правильными данными', async () => {
        createOrder.mockResolvedValue({
            id: '123',
            display_id: 'CWL-06482',
        });

        render(<CheckOutModal {...defaultProps} />);
        selectTime();

        fireEvent.click(screen.getByLabelText('Картой'));
        fireEvent.click(screen.getByText('Подтвердить'));

        await waitFor(() => {
            expect(createOrder).toHaveBeenCalledWith(
                10,
                [
                    { id: 1, name: 'Капучино', price: 220, quantity: 2 },
                    { id: 2, name: 'Круассан', price: 150, quantity: 1 },
                ],
                370,
                '09:30:00',
                'card'
            );
        });
    });
});

// test('Кнопка перейти к заказам вызывает onTabChange, initialView и onClose', async () => {
//     createOrder.mockResolvedValue({
//         id: '123',
//         display_id: 'CWL-06482',
//     });

//     render(<CheckOutModal {...defaultProps} />);
//     selectTime();

//     fireEvent.click(screen.getByText(''))
// })