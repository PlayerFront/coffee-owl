import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TabContent from './TabContent';

jest.mock('../../../Home/Home', () => ({
    __esModule: true,
    default: () => <div data-testid='mock-home'>Home Component</div>
}));
jest.mock('../../../Catalog/Catalog', () => ({
    __esModule: true,
    default: () => <div data-testid='mock-catalog'>Catalog Component</div>
}));
jest.mock('../../../Cart/Cart', () => ({
    __esModule: true,
    default: () => <div data-testid='mock-cart'>Cart Component</div>
}));
jest.mock('../../../Profile/Profile', () => {

    return function MockProfile({ onLogout }) {
        return (
            <div data-testid="mock-profile">
                Profile Component
                {onLogout &&
                    <button
                        onClick={onLogout}
                        data-testid="mock-logout">
                        Logout
                    </button>}
            </div>
        );
    };
});

describe('TabContent component', () => {
    const mockOnLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится Home при activeTab="home"', () => {
        render(<TabContent activeTab='home' onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-home')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-catalog')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-cart')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-profile')).not.toBeInTheDocument();
    });

    test('Рендерится Catalog при activeTab="catalog"', () => {
        render(<TabContent activeTab='catalog' onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-catalog')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-cart')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-profile')).not.toBeInTheDocument();
    });

    test('Рендерится Cart при activeTab="cart"', () => {
        render(<TabContent activeTab='cart' onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-cart')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-catalog')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-profile')).not.toBeInTheDocument();
    });

    test('Рендерится Profile при activeTab="profile"', () => {
        render(<TabContent activeTab='profile' onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-profile')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-catalog')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-cart')).not.toBeInTheDocument();
    });

    test('Передает Logout в компонент Profile и вызывает его при клике', () => {
        render(<TabContent activeTab='profile' onLogout={mockOnLogout} />);

        const logoutButton = screen.getByTestId('mock-logout');
        expect(logoutButton).toBeInTheDocument();

        fireEvent.click(logoutButton);
        expect(mockOnLogout).toHaveBeenCalledTimes(1);

    });

    test('Ничего не рендерится, если ativeTab неизвестен', () => {
        render(<TabContent activeTab='unknown' onLogout={mockOnLogout} />);

        expect(screen.queryByTestId('mock-home')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-catalog')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-cart')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-profile')).not.toBeInTheDocument();
    })
})

