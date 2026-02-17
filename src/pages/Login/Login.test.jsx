import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { loginUser } from "../../api/authApi";

jest.mock('./_login.scss', () => ({}));

// мок кнопки отправки кода
jest.mock('../../components/Button/Button', () => ({
    __esModule: true,
    default: ({ children, onClick, disabled, variant, size, type = 'button' }) => (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            data-testid={`mock-button-${variant || 'default'}`}
            data-size={size}
        >
            {children}
        </button>
    )
}));

// мок для кнопки политики конфид.
jest.mock('../../components/PolicyModal/PolicyModal', () => ({
    __esModule: true,
    default: ({ onClose }) => (
        <div data-testid="mock-policy-modal">
            <p>Модальное окно с политикой конфиденциальности</p>
            <button
                data-testid="mock-modal-close"
                onClick={onClose}
            >
                Закрыть
            </button>
        </div>
    )
}));

jest.mock('../../api/authApi', () => ({
    loginUser: jest.fn()
}));

describe('Login component', () => {
    const mockOnNavigate = jest.fn();
    const mockOnPhoneSubmit = jest.fn();

    const defaultProps = {
        phone: '+70000000000',
        onNavigate: mockOnNavigate,
        onPhoneSubmit: mockOnPhoneSubmit,
        isLoading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендер происходит без ошибок', () => {
        render(<Login {...defaultProps} />)

        expect(screen.getByText('Вход')).toBeInTheDocument();
        expect(screen.getByLabelText(/введите номер телефона, указанный при регистрации/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('+7')).toBeInTheDocument();
        expect(screen.getByText('Нажимая кнопку, вы соглашаетесь с')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /политикой конфиденциальности/i })).toBeInTheDocument();

        expect(screen.getByTestId('mock-button-primary')).toBeInTheDocument();
        expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Отправить код');
    }); // успех

    test('Кнопка отправки кода становится активной в момент корректного введения номера телефона', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Login {...defaultProps} />);

        const input = screen.getByPlaceholderText('+7');
        const submitButton = screen.getByTestId('mock-button-primary');

        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();

        await user.type(input, '+70000000000');

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        }, { timeout: 1000 });
    }) // здесь успех

    test('Кнопка блокируется при отправке данных, isLoading = true', async () => {
        const user = userEvent.setup({ delay: null });

        loginUser.mockImplementation(() => {
            return new Promise(resolve => {
                setTimeout(() => resolve({
                    success: true,
                    phone: '+70000000000'
                }), 500);
            });
        });

        render(<Login {...defaultProps} />);

        const input = screen.getByPlaceholderText('+7');
        const submitButton = screen.getByTestId('mock-button-primary');

        await user.type(input, '+70000000000');

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });

        await act(async () => {
            await user.click(submitButton);
        });

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

        expect(submitButton).toHaveTextContent('Отправка...');

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith('+70000000000');
        }, { timeout: 1000 });

    }) // успех

    test('Открывает и закрывает модальное окно с политикой конфиденциальности', async () => {
        const user = userEvent.setup({ delay: null });

        render(<Login {...defaultProps} />);

        expect(screen.queryByTestId('mock-policy-modal')).not.toBeInTheDocument();

        const policyButton = screen.getByRole('button', {
            name: /политикой конфиденциальности/i
        });

        await user.click(policyButton);
        expect(screen.getByTestId('mock-policy-modal')).toBeInTheDocument();

        const closeButton = screen.getByTestId('mock-modal-close');
        expect(closeButton).toBeInTheDocument();

        await user.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByTestId('mock-policy-modal')).not.toBeInTheDocument();
        });
    }); // успешный успех

    test('Показывается ошибка при неверном формате телефона', async () => {
        const user = userEvent.setup({ delay: null });

        render(<Login {...defaultProps} />);

        const input = screen.getByPlaceholderText('+7');

        await user.type(input, '123');

        await waitFor(() => {
            expect(screen.getByText('Формат +7 (XXX) XXX-XX-XX')).toBeInTheDocument();
        });

        expect(screen.getByTestId('mock-button-primary')).toBeDisabled();
    }); // успех

    test('Вызывается onPhoneSubmit после успешной отправки', async () => {
        const user = userEvent.setup({ delay: null });

        loginUser.mockResolvedValue({
            success: true,
            phone: '+70000000000'
        });

        render(<Login {...defaultProps} />);

        const input = screen.getByPlaceholderText('+7');
        const submitButton = screen.getByTestId('mock-button-primary');

        await user.type(input, '+70000000000');
        await user.click(submitButton);


        await waitFor(() => {
            expect(mockOnPhoneSubmit).toHaveBeenCalledWith('+70000000000');
        });
    });

    test('Показывается ошибка, если пользователь не найден', async () => {
        const user = userEvent.setup({ delay: null });

        loginUser.mockRejectedValue(new Error('Пользователь не найден. Зарегистрируйтесь'));

        render(<Login {...defaultProps} />);

        const input = screen.getByPlaceholderText('+7');
        const submitButton = screen.getByTestId('mock-button-primary');

        await user.type(input, '+71234567890');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Пользователь не найден. Зарегистрируйтесь')).toBeInTheDocument();
        });
    }) // успех

    test('Корректно форматируется телефон перед отправкой', async () => {
        const user = userEvent.setup({ delay: null });
        render(<Login {...defaultProps} />);

        const input = screen.getByPlaceholderText('+7');
        await user.type(input, '+70000000000');

        await user.click(screen.getByTestId('mock-button-primary'));

        expect(loginUser).toHaveBeenCalledWith('+70000000000');
    });
})