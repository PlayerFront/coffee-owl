import React from "react";
import { render, screen, fireEvent, getAllByTestId } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cart from "./Cart";
import useCart from "../../utils/useCart";
import { Products } from "../Catalog/mockData";

jest.mock('../../utils/useCart');
jest.mock('../Catalog/mockData', () => ({
    Products: [
        { id: 1, name: 'Капучино', volume: '220 мл', price: 220, category: 'coffee', image: 'cappuccino.jpg'},
        { id: 2, name: 'Круассан', volume: '120 гр', price: 150, category: 'pastry', image: 'croissant.jpg'}
    ]
}));

jest.mock('../../components/CartIcon/CartIcon', () => ({
    __esModule: true,
    default: () => <span data-testid="cart-icon">🛒</span>
}));

jest.mock('../../components/Button/Button', () => ({
    __esModule: true,
    default: ({ children, onClick, variant, size}) => (
        <button onClick={onClick} data-testid={`button--${variant} button--${size}`}>
            {children}
        </button>
    )
}));

jest.mock('./components/CartItem/CartItem', () => ({
    __esModule: true,
    default: ({ product, quantity, onAdd, onRemove }) => (
        <div data-testid='cart-item'>
            <span>{product.name}</span>
            <span>{quantity}</span>
            <button onClick={onAdd}>+</button>
            <button onClick={onRemove}>-</button>
        </div>
    )
}));

describe('Cart Component', () => {
    const mockGetQuantity = jest.fn();
    const mockGetTotalItems = jest.fn();
    const mockOnTabChange = jest.fn();
    const mockGetTotalPrice = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Отображается пустая корзина, а кнопка "Перейти в каталог" вызывает onTabChange', async () => {
        const user = userEvent.setup({ delay: null });
        mockGetTotalItems.mockReturnValue(0);
        useCart.mockReturnValue({
            cart: {},
            getQuantity: mockGetQuantity,
            getTotalItems: mockGetTotalItems
        });

        render(<Cart onTabChange={mockOnTabChange} />);

        expect(screen.getByText('Корзина')).toBeInTheDocument();
        expect(screen.getByText('Корзина пуста')).toBeInTheDocument();
        expect(screen.getByText('Перейти в каталог')).toBeInTheDocument();

        await user.click(screen.getByText('Перейти в каталог'));
        expect(mockOnTabChange).toHaveBeenCalledWith('catalog');
    });

    test('В корзине отображаются товары, их количество, корректно отображается итоговая сумма', () => {
        mockGetTotalItems.mockReturnValue(3);
        mockGetQuantity.mockImplementation((id) => {
            if (id === 1) return 2; //Cappuccino ID
            if (id === 2) return 1; // Croissant ID
        });

        useCart.mockReturnValue({
            cart: { 1: 2, 2: 1 },
            getQuantity: mockGetQuantity,
            getTotalItems: mockGetTotalItems,
            getTotalPrice: mockGetTotalPrice
        });

        render(<Cart onTabChange={mockOnTabChange} />);

        expect(screen.getByText('Корзина (3)')).toBeInTheDocument();
        expect(screen.getAllByTestId('cart-item')).toHaveLength(2);

        expect(screen.getByText('Капучино')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        expect(screen.getByText('Круассан')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();

        expect(screen.getByText('590 ₽')).toBeInTheDocument();
        expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
    });

})