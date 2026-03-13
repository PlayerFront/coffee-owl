import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabBar from "./TabBar";
import './_tab-bar.scss';

jest.mock('../../../../components/HomeIcon/HomeIcon', () => ({
    __esModule: true,
    default: ({ active }) => (
        <svg data-testid='home-icon' data-active={active ? 'true' : 'false'} />
    )
}));
jest.mock('../../../../components/CatalogIcon/CatalogIcon', () => ({
    __esModule: true,
    default: ({ active }) => (
        <svg data-testid='catalog-icon' data-active={active ? 'true' : 'false'} />
    )
}));
jest.mock('../../../../components/CartIcon/CartIcon', () => ({
    __esModule: true,
    default: ({ active }) => (
        <svg data-testid='cart-icon' data-active={active ? 'true' : 'false'} />
    )
}));
jest.mock('../../../../components/ProfileIcon/ProfileIcon', () => ({
    __esModule: true,
    default: ({ active }) => (
        <svg data-testid='profile-icon' data-active={active ? 'true' : 'false'} />
    )
}));

describe('TabBar component', () => {
    const mockOnTabChange = jest.fn();
    const defaultProps = {
        activeTab: 'home',
        onTabChange: mockOnTabChange
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерятся все 4 вкладки с исконками и названиями', () => {
        render(<TabBar {...defaultProps} />)

        expect(screen.getByText('Главная')).toBeInTheDocument();
        expect(screen.getByText('Каталог')).toBeInTheDocument();
        expect(screen.getByText('Корзина')).toBeInTheDocument();
        expect(screen.getByText('Профиль')).toBeInTheDocument();

        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
        expect(screen.getByTestId('catalog-icon')).toBeInTheDocument();
        expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
        expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    });

    test('Подсвечивает активную вкладку', () => {
        render(<TabBar {...defaultProps} activeTab='catalog' />);

        const catalogButton = screen.getByText('Каталог').closest('button');
        const homeButton = screen.getByText('Главная').closest('button');

        expect(catalogButton).toHaveClass('tab-bar__button--active');
        expect(homeButton).not.toHaveClass('tab-bar__button--active');
    });

    test('Вызывает onTabChange с правильным id при клике', async () => {
        const user = userEvent.setup({ delay: null });
        render(<TabBar {...defaultProps} />);

        await user.click(screen.getByText('Каталог'));
        expect(mockOnTabChange).toHaveBeenCalledWith('catalog');

        await user.click(screen.getByText('Корзина'));
        expect(mockOnTabChange).toHaveBeenCalledWith('cart');
    });

    test('Иконки получают пропс active корректно', () => {
        render(<TabBar {...defaultProps} activeTab='profile' />);

        expect(screen.getByTestId('profile-icon')).toHaveAttribute('data-active', 'true');

        expect(screen.getByTestId('home-icon')).toHaveAttribute('data-active', 'false');
        expect(screen.getByTestId('catalog-icon')).toHaveAttribute('data-active', 'false');
        expect(screen.getByTestId('cart-icon')).toHaveAttribute('data-active', 'false');
    });

    test('Все кнопки имеют правильные классы и структуру', () => {
        render(<TabBar {...defaultProps} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(4);

        buttons.forEach(button => {
            expect(button).toHaveClass('tab-bar__button');
            expect(button.querySelector('svg')).toBeInTheDocument();
            expect(button.querySelector('.tab-bar__label')).toBeInTheDocument();
        });
    });
})