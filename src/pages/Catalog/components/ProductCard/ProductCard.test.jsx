import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";

jest.mock('../../../../components/CartIcon/CartIcon', () => ({
    __esModule: true,
    default: () => <span data-testid='cart-icon'>Cart</span>
}));

jest.mock('../../../../components/MinusIcon/MinusIcon', () => ({
    __esModule: true,
    default: () => <span data-testid='minus-icon'>-</span>
}));

jest.mock('../../../../components/PlusIcon/PlusIcon', () => ({
    __esModule: true,
    default: () => <span data-testid='plus-icon'>+</span>
}));

jest.mock('../../../../components/Button/Button', () => ({
    __esModule: true,
    default: ({ children, onClick, variant, size }) => (
        <button onClick={onClick} data-testid={`button-${variant}`}>
            {children}
        </button>
    )
}));

const mockProduct = {
    id: 1,
    name: 'Латте',
    volume: '300 мл',
    price: 250,
    image: 'test.jpg'
};

describe('Product Card Component', () => {
    const mockOnAdd = jest.fn();
    const mockOnRemove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Отображается вся информация о товаре', () => {
        render(
            <ProductCard
                product={mockProduct}
                quantity={0}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(screen.getByText('Латте')).toBeInTheDocument();
        expect(screen.getByText('300 мл')).toBeInTheDocument();
        expect(screen.getByText('250 ₽')).toBeInTheDocument();
    });

    test('Отображается кнопка Заказать при quantity = 0', () => {
        render(
            <ProductCard
                product={mockProduct}
                quantity={0}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(screen.getByText('Заказать')).toBeInTheDocument();
        expect(screen.queryByTestId('minus-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
    });

    test('Отображаются + и - при quantity > 0', () => {
        render(
            <ProductCard
                product={mockProduct}
                quantity={2}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
        expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
        expect(screen.getByText('(2)')).toBeInTheDocument();
        expect(screen.queryByText('Заказать')).not.toBeInTheDocument();
    });

    test('При клике Заказать вызывается onAdd', () => {
        render(
            <ProductCard
                product={mockProduct}
                quantity={0}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        fireEvent.click(screen.getByText('Заказать'));
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
    test('При клике на иконку + вызывается onAdd', () => {
        render(
            <ProductCard
                product={mockProduct}
                quantity={2}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        fireEvent.click(screen.getByTestId('plus-icon').parentElement);
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
    test('При клике на иконку - вызывается onRemove', () => {
        render(
            <ProductCard
                product={mockProduct}
                quantity={2}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        fireEvent.click(screen.getByTestId('minus-icon').parentElement);
        expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });
})