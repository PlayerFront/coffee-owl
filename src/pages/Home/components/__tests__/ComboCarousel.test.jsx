import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComboCarousel from '../ComboCarousel/ComboCarousel';


jest.mock('../../../../components/ComboIcon/ComboIcon', () => ({
    __esModule: true,
    default: () => <span>Иконка комбо</span>,
}));

describe('ComboCarousel component', () => {
    const mockOnComboClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится заголовок Выгодные комбо', () => {
        render(<ComboCarousel onComboClick={mockOnComboClick} />);
        expect(screen.getByText('Выгодные комбо')).toBeInTheDocument();
    });

    test('Рендерятся три слайда', () => {
        render(<ComboCarousel onComboClick={mockOnComboClick} />);
        const slides = screen.getAllByTestId('swiper-slide');
        expect(slides).toHaveLength(3);
    });

    test('Рендерятся три картинки', () => {
        render(<ComboCarousel onComboClick={mockOnComboClick} />);
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);

    });

    test('Клик по слайду вызывает onComboClick с filter Combo', () => {
        render(<ComboCarousel onComboClick={mockOnComboClick} />);
        const slides = screen.getAllByTestId('swiper-slide');
        fireEvent.click(slides[0]);

        expect(mockOnComboClick).toHaveBeenCalledWith('combo');
        expect(mockOnComboClick).toHaveBeenCalledTimes(1);
    });

    test('Клик по второму слайду вызывает onComboClick с filter combo', () => {
        render(<ComboCarousel onComboClick={mockOnComboClick} />);
        const slides = screen.getAllByTestId('swiper-slide');
        fireEvent.click(slides[1]);
        expect(mockOnComboClick).toHaveBeenCalledWith('combo');
    });

    test('Клик по слайду не ломает приложение, если onComboClick не передан', () => {
        render(<ComboCarousel />);
        const slides = screen.getAllByTestId('swiper-slide');
        expect(() => fireEvent.click(slides[0])).not.toThrow();
    });
});