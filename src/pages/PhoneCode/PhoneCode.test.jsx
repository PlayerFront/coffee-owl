import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhoneCode from "./PhoneCode";
import { resendCode, verifyCode } from "../../api/authApi";

jest.mock('./_phone-code.scss', () => ({}));

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

jest.mock('../../api/authApi', () => ({
    verifyCode: jest.fn(),
    resendCode: jest.fn()
}))

describe('PhoneCode component', () => {
    const mockOnCodeSubmit = jest.fn();
    const mockOnResendCode = jest.fn();
    const mockOnBack = jest.fn();

    const defaultProps = {
        phone: '+79991234567',
        onCodeSubmit: mockOnCodeSubmit,
        onResendCode: mockOnResendCode,
        onBack: mockOnBack,
        // isLoading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Рендер происходит без ошибок и с правильными пропсами', () => {
        render(<PhoneCode {...defaultProps} />);

        expect(screen.getByText('Вам отправлен код подтверждения')).toBeInTheDocument();
        expect(screen.getByText('На номер')).toBeInTheDocument();
        expect(screen.getByText('+7 *** ***-**-67')).toBeInTheDocument();

        const inputs = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(4);

        expect(screen.getByTestId('mock-button-primary')).toBeInTheDocument();
        expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Подтвердить');
    }); // Успех

    test('Правмльно маскирует номер телефона', () => {
        const { rerender } = render(<PhoneCode {...defaultProps} />);
        expect(screen.getByText('+7 *** ***-**-67')).toBeInTheDocument();

        rerender(<PhoneCode {...defaultProps} phone="+79998887766" />);
        expect(screen.getByText('+7 *** ***-**-66')).toBeInTheDocument();


        rerender(<PhoneCode {...defaultProps} phone="" />);
        expect(screen.queryByText('+7 *** ***-**-')).not.toBeInTheDocument();
    }); // успех

    test('Автоматический фокус на первом поле ввода', () => {
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');
        expect(inputs[0]).toHaveFocus();
    }); // успех

    test('Ввод цифр происходит с автопереходом', async () => {
        const user = userEvent.setup({ delay: null });
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        await user.type(inputs[0], '1');
        expect(inputs[0]).toHaveValue('1');
        expect(inputs[1]).toHaveFocus();

        await user.type(inputs[1], '2');
        expect(inputs[1]).toHaveValue('2');
        expect(inputs[2]).toHaveFocus();

        await user.type(inputs[2], '3');
        expect(inputs[2]).toHaveValue('3');
        expect(inputs[3]).toHaveFocus();

        await user.type(inputs[3], '4');
        expect(inputs[3]).toHaveValue('4');
        expect(inputs[3]).toHaveFocus();
    }); // успех

    test('Обрабатывается backspace для возврата к предыдущему полю', async () => {
        const user = userEvent.setup({ delay: null });
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        await user.type(inputs[0], '1');
        await user.keyboard('{Backspace}');

        expect(inputs[0]).toHaveFocus();

        await user.type(inputs[0], '1');
        await user.type(inputs[1], '2');

        await user.keyboard('{Backspace}');
        expect(inputs[1]).toHaveFocus();
    }); // успех

    test('Обрабатывается вставка кода из буфера обмена', async () => {
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        fireEvent.paste(inputs[0], {
            clipboardData: {
                getData: (type) => '1111'
            }
        });

        expect(inputs[0]).toHaveValue('1');
        expect(inputs[1]).toHaveValue('1');
        expect(inputs[2]).toHaveValue('1');
        expect(inputs[3]).toHaveValue('1');
        expect(inputs[3]).toHaveFocus();
    }); // успех

    test('Автосабмит после заполнения всех 4 полей', async () => {
        const user = userEvent.setup({ delay: null });
        mockOnCodeSubmit.mockResolvedValueOnce({ success: true });

        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        await user.type(inputs[0], '1');
        await user.type(inputs[1], '2');
        await user.type(inputs[2], '3');
        await user.type(inputs[3], '4');

        await waitFor(() => {
            expect(mockOnCodeSubmit).toHaveBeenCalledWith('1234');
        });
    }); // успешный успех

    test('Показывается ошибка при неверном коде', async () => {
        const user = userEvent.setup({ delay: null });
        const errorMessage = 'Неверный код. Попробуйте еще раз';
        mockOnCodeSubmit.mockRejectedValueOnce(new Error(errorMessage));

        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        await user.type(inputs[0], '1');
        await user.type(inputs[1], '1');
        await user.type(inputs[2], '1');
        await user.type(inputs[3], '1');

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        expect(inputs[0]).toHaveValue('');
    }); // успех

    test('Таймер обратного отсчета отображается и обновляется', () => {
        render(<PhoneCode {...defaultProps} />);

        expect(screen.getByText(/Отправить код повторно через 00:60/)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(screen.getByText(/Отправить код повторно через 00:50/)).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(50000);
        });

        expect(screen.getByTestId('mock-button-secondary')).toBeInTheDocument();
        expect(screen.getByTestId('mock-button-secondary')).toHaveTextContent('Отправить код повторно');
    }); // успех

    test('Рендериться кнопка поторной отправки кода после истечения таймера', async () => {
        render(<PhoneCode {...defaultProps} />);

        expect(screen.getByText('Вам отправлен код подтверждения')).toBeInTheDocument();

        expect(screen.getByText(/Отправить код повторно через/)).toBeInTheDocument();

        expect(screen.queryByText('Отправить код повторно')).not.toBeInTheDocument();
    }); // успех на рендер

    test('Поля и кнопки блокируются при загрузке, isLoading = true', async () => {
        const user = userEvent.setup({ delay: null });

        mockOnCodeSubmit.mockImplementation(() => {
            return new Promise(resolve => {
                setTimeout(() => resolve({ success: true }), 100);
            });
        });

        render(<PhoneCode {...defaultProps} isLoading={true} />);

        const inputs = screen.getAllByRole('textbox');
        const submitButton = screen.getByTestId('mock-button-primary');

        await user.type(inputs[0], '1');
        await user.type(inputs[1], '2');
        await user.type(inputs[2], '3');
        await user.type(inputs[3], '4');

        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

        inputs.forEach(input => {
            expect(input).toBeDisabled();
        }); // успех
    });

    test('Кнопка подтверждения становится активной в момент введения 4 цифры в коде', async () => {
        const user = userEvent.setup({ delay: null });
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');
        const submitButton = screen.getByTestId('mock-button-primary');

        expect(submitButton).toBeInTheDocument();

        expect(submitButton).toBeDisabled();

        await user.type(inputs[0], '1');
        await user.type(inputs[1], '2');
        await user.type(inputs[2], '3');
        await user.type(inputs[3], '4');

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        }, { timeout: 1000 });
    }); // успех

    test('Поля ввода принимают только цифры', async () => {
        const user = userEvent.setup({ delay: null });
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        await user.type(inputs[0], 'a');
        expect(inputs[0]).toHaveValue('');

        await user.type(inputs[0], '!');
        expect(inputs[0]).toHaveValue('');

        await user.type(inputs[0], '5');
        expect(inputs[0]).toHaveValue('5');
    }); // успех

    test('В полях ввода поддерживается навигация стрелками', async () => {
        const user = userEvent.setup({ delay: null });
        render(<PhoneCode {...defaultProps} />);

        const inputs = screen.getAllByRole('textbox');

        expect(inputs[0]).toHaveFocus();

        await user.type(inputs[0], '{ArrowRight}');
        expect(inputs[1]).toHaveFocus();

        await user.type(inputs[1], '{ArrowLeft}');
        expect(inputs[0]).toHaveFocus();

        await user.type(inputs[0], '1');
        await user.type(inputs[0], '{ArrowRight}');
        expect(inputs[1]).toHaveFocus();
    }) // успех, процент покрытия 78%
})