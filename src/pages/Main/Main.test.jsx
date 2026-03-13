import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Main from './Main';

jest.mock('./components/TabBar/TabBar', () => ({
    __esModule: true,
    default: ({ activeTab, onTabChange }) => (
        <div data-testid="mock-tab-bar">
            <button 
                data-testid="mock-tab-home" 
                onClick={() => onTabChange('home')}
            >
                Home
            </button>
            <button 
                data-testid="mock-tab-catalog" 
                onClick={() => onTabChange('catalog')}
            >
                Catalog
            </button>
            <button 
                data-testid="mock-tab-cart" 
                onClick={() => onTabChange('cart')}
            >
                Cart
            </button>
            <button 
                data-testid="mock-tab-profile" 
                onClick={() => onTabChange('profile')}
            >
                Profile
            </button>
            <span data-testid="mock-active-tab">{activeTab}</span>
        </div>
    )
}));

jest.mock('./components/TabContent/TabContent', () => ({
    __esModule: true,
    default: ({ activeTab, onLogout }) => (
        <div data-testid="mock-tab-content">
            Content for: {activeTab}
            {activeTab === 'profile' && (
                <button data-testid="mock-logout" onClick={onLogout}>
                    Logout
                </button>
            )}
        </div>
    )
}));

describe('Main Component', () => {
    const mockOnLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('рендерит TabBar и TabContent', () => {
        render(<Main onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-tab-bar')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tab-content')).toBeInTheDocument();
    });

    test('начальное состояние activeTab = "home"', () => {
        render(<Main onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-active-tab')).toHaveTextContent('home');
        expect(screen.getByTestId('mock-tab-content')).toHaveTextContent('Content for: home');
    });

    test('меняет activeTab при клике на вкладку', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Main onLogout={mockOnLogout} />);

        await user.click(screen.getByTestId('mock-tab-catalog'));
        expect(screen.getByTestId('mock-active-tab')).toHaveTextContent('catalog');
        expect(screen.getByTestId('mock-tab-content')).toHaveTextContent('Content for: catalog');

        await user.click(screen.getByTestId('mock-tab-profile'));
        expect(screen.getByTestId('mock-active-tab')).toHaveTextContent('profile');
        expect(screen.getByTestId('mock-tab-content')).toHaveTextContent('Content for: profile');
    });

    test('передает onLogout в TabContent и вызывает его', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Main onLogout={mockOnLogout} />);

        await user.click(screen.getByTestId('mock-tab-profile'));

        const logoutButton = screen.getByTestId('mock-logout');
        await user.click(logoutButton);

        expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });

    test('сохраняет activeTab при повторном рендере', () => {
        const { rerender } = render(<Main onLogout={mockOnLogout} />);

        fireEvent.click(screen.getByTestId('mock-tab-cart'));

        rerender(<Main onLogout={mockOnLogout} />);

        expect(screen.getByTestId('mock-active-tab')).toHaveTextContent('cart');
    });

    test('имеет правильную структуру DOM', () => {
        const { container } = render(<Main onLogout={mockOnLogout} />);

        expect(container.firstChild).toHaveClass('main');
    });
});