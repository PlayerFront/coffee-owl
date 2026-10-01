import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from "../SearchBar/SearchBar";

jest.mock('../../../../components/SearchIcon/SearchIcon', () => () => <span>Поиск</span>);

describe('SearchBar', () => {
    const mockOnSelectProduct = jest.fn();
    const mockOnAddToCart = jest.fn();
    const mockGetQuantity = jest.fn(() => 0);

    const defaultProps = {
        onSelectProduct: mockOnSelectProduct,
        onAddToCart: mockOnAddToCart,
        getQuantity: mockGetQuantity,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Рендерится поле ввода с плейсхолдером', () => {
        render(<SearchBar {...defaultProps} />);
        expect(screen.getByPlaceholderText('Найти кофе, десерт...')).toBeInTheDocument();
    });

    test('Список результатов изначально скрыт', () => {
        render(<SearchBar {...defaultProps} />);
        expect(screen.queryByText('Капучино')).not.toBeInTheDocument();
    });

    test('Отображаются результаты после ввода и debounce', async () => {
        render(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Найти кофе, десерт...');
        fireEvent.change(input, { target: { value: 'капучино' } });
        expect(screen.queryByText('Капучино')).not.toBeInTheDocument();

        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Капучино')).toBeInTheDocument();
        });
    });

    test('Отображается Ничего не найдено при пустом результате', async () => {
        render(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Найти кофе, десерт...');
        fireEvent.change(input, { target: { value: 'qwerty123' } });

        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
        });
    });

    test('Клик по результату вызывает onSelectProduct', async () => {
        render(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Найти кофе, десерт...');
        fireEvent.change(input, { target: { value: 'капучино' } });

        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Капучино')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Капучино'));

        expect(mockOnSelectProduct).toHaveBeenCalledTimes(1);
    });

    test('Клик по кнопке + вызывает onAddToCart', async () => {
        render(<SearchBar {...defaultProps} />);

        const input = screen.getByPlaceholderText('Найти кофе, десерт...');
        fireEvent.change(input, { target: { value: 'капучино' } });

        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Капучино')).toBeInTheDocument();
        });

        const addButtons = screen.getAllByText('+');
        fireEvent.click(addButtons[0]);

        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    });

    test('Список закрывается при клике вне зоны поиска', async () => {
        render(
            <div>
                <SearchBar {...defaultProps} />
                <div data-testid="outside">Вне зоны поиска</div>
            </div>
        );

        const input = screen.getByPlaceholderText('Найти кофе, десерт...');
        fireEvent.change(input, { target: { value: 'капучино' } });

        jest.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Капучино')).toBeInTheDocument();
        });

        fireEvent.mouseDown(screen.getByTestId('outside'));
        expect(screen.queryByText('Капучино')).not.toBeInTheDocument();
    });

});