import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeasonalCarousel from '../SeasonalCarousel/SeasonalCarousel';

jest.mock('../SeasonalCarousel/SeasonalCard', () => {
    return function MockSeasonalCard({ item, quantity, onClick, onAddToCart, onRemove }) {
        return (
            <div data-testid="seasonal-card">
                <span data-testid="card-name">{item.name}</span>
                <button data-testid="card-click" onClick={onClick}>Открыть</button>
                <button data-testid="card-add" onClick={onAddToCart}>Добавить</button>
                <button data-testid="card-remove" onClick={onRemove}>Убрать</button>
                <span data-testid="card-quantity">{quantity}</span>
            </div>
        );
    };
});

describe('Seasonal Carousel component', () => {
    const mockOnSeasonalClick = jest.fn();
    const mockOnAddToCart = jest.fn();
    const mockOnRemoveFromCart = jest.fn();
    const mockGetQuantity = jest.fn(() => 0);

    const defaultProps = {
        onSeasonalClick: mockOnSeasonalClick,
        onAddToCart: mockOnAddToCart,
        onRemoveFromCart: mockOnRemoveFromCart,
        getQuantity: mockGetQuantity,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится заголовок Хиты сезона', () => {
        render(<SeasonalCarousel {...defaultProps} />);
        expect(screen.getByText('Хиты сезона')).toBeInTheDocument();
    });

    test('Рендерятся только сезонные товары', () => {
        render(<SeasonalCarousel {...defaultProps} />);
        const cards = screen.getAllByTestId('seasonal-card');
        expect(cards).toHaveLength(5);
    });

    test('Клик по карточке товара вызывает onSeasonalClick', () => {
        render(<SeasonalCarousel {...defaultProps} />);
        const clickButtons = screen.getAllByTestId('card-click');
        fireEvent.click(clickButtons[0]);
        expect(mockOnSeasonalClick).toHaveBeenCalledTimes(1);
    });

    test('Клик по кнопке добавления вызывает onAddToCart c id товара', () => {
        render(<SeasonalCarousel {...defaultProps} />);
        const addButtons = screen.getAllByTestId('card-add');
        fireEvent.click(addButtons[0]);
        expect(mockOnAddToCart).toHaveBeenCalledWith(101);
    });

    test('Клик по кнопке удаления вызывает onRemoveFromCart с id товара', () => {
        render(<SeasonalCarousel {...defaultProps} />);
        const removeButtons = screen.getAllByTestId('card-remove');
        fireEvent.click(removeButtons[0]);
        expect(mockOnRemoveFromCart).toHaveBeenCalledWith(101);
    });

    test('Передается quantity в карточку через getQuantity', () => {
        mockGetQuantity.mockReturnValue(3);
        render(<SeasonalCarousel {...defaultProps} />);
        const quantities = screen.getAllByTestId('card-quantity');
        expect(quantities[0]).toHaveTextContent('3');
    });

    test('getQuantity вызывается для каждого товара', () => {
        render(<SeasonalCarousel {...defaultProps} />);
        const calledIds = mockGetQuantity.mock.calls.map(call => call[0]);

        expect(calledIds).toContain(101);
        expect(calledIds).toContain(102);
        expect(calledIds).toContain(103);
        expect(calledIds).toContain(104);
    });
})