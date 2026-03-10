import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterStep1 from './RegisterStep1';
import { registerUser } from '../../api/authApi';

// Моки для стилей
jest.mock('./_register-step1.scss', () => ({}));

// Мок для API
jest.mock('../../api/authApi', () => ({
  registerUser: jest.fn()
}));

// Мок для иконок
jest.mock('../../components/AcceptIcon/AcceptIcon', () => ({
  __esModule: true,
  default: () => <div data-testid="accept-icon" />
}));

// Мок для Button
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

// Мок для PolicyModal
jest.mock('../../components/PolicyModal/PolicyModal', () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div data-testid="mock-policy-modal">
      <p>Модальное окно с политикой конфиденциальности</p>
      <button data-testid="mock-modal-close" onClick={onClose}>Закрыть</button>
    </div>
  )
}));

// Мок для BackButton
jest.mock('../../components/BackButton/BackButton', () => ({
  __esModule: true,
  default: ({ onNavigate, fallbackpage, children }) => (
    <button
      data-testid="mock-back-button"
      onClick={() => onNavigate(fallbackpage)}
    >
      {children || 'Назад'}
    </button>
  )
}));

describe('RegisterStep1 Component', () => {
  const mockOnNavigate = jest.fn();
  const mockOnPhoneSubmit = jest.fn();

  const defaultProps = {
    onNavigate: mockOnNavigate,
    onPhoneSubmit: mockOnPhoneSubmit
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит все элементы формы регистрации', () => {
    render(<RegisterStep1 {...defaultProps} />);

    expect(screen.getByText('Регистрация')).toBeInTheDocument();

    expect(screen.getByLabelText('Ваше имя *')).toBeInTheDocument();
    expect(screen.getByLabelText('Ваш телефон *')).toBeInTheDocument();
    expect(screen.getByLabelText('Ваша электронная почта *')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('+7')).toBeInTheDocument();

    expect(screen.getByText('Нажимая кнопку, вы соглашаетесь с')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /политикой конфиденциальности/i })).toBeInTheDocument();

    expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Отправить код');
    expect(screen.getByTestId('mock-back-button')).toHaveTextContent('Назад');
  });

  test('кнопка отправки заблокирована при пустых полях', () => {
    render(<RegisterStep1 {...defaultProps} />);

    const submitButton = screen.getByTestId('mock-button-primary');
    expect(submitButton).toBeDisabled();
  });

  // Валидация имени пользователя
  describe('валидация поля "Имя"', () => {
    test('показывает ошибку при слишком коротком имени', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const nameInput = screen.getByLabelText('Ваше имя *');
      await user.type(nameInput, 'А');

      expect(await screen.findByText('Минимум 2 символа')).toBeInTheDocument();
      expect(screen.queryByTestId('accept-icon')).not.toBeInTheDocument();
    });

    test('показывает ошибку при недопустимых символах', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const nameInput = screen.getByLabelText('Ваше имя *');
      await user.type(nameInput, 'Анна123');

      expect(await screen.findByText('Только буквы, пробелы и дефисы')).toBeInTheDocument();
    });

    test('показывает иконку успеха при валидном имени', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const nameInput = screen.getByLabelText('Ваше имя *');
      await user.type(nameInput, 'Анна');

      await waitFor(() => {
        expect(screen.getByTestId('accept-icon')).toBeInTheDocument();
      });
      expect(screen.queryByText('Минимум 2 символа')).not.toBeInTheDocument();
    });
  });

  // Валидация номера телефона пользователя
  describe('валидация поля "Телефон"', () => {
    test('показывает ошибку при неверном формате', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const phoneInput = screen.getByLabelText('Ваш телефон *');
      await user.type(phoneInput, '12345');

      expect(await screen.findByText('Формат +7 (XXX) XXX-XX-XX')).toBeInTheDocument();
    });

    test('показывает иконку успеха при корректном телефоне', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const phoneInput = screen.getByLabelText('Ваш телефон *');
      await user.type(phoneInput, '+79991234567');

      await waitFor(() => {
        expect(screen.getByTestId('accept-icon')).toBeInTheDocument();
      });
    });
  });

  // Валидация эл.почты пользователя
  describe('валидация поля "Email"', () => {
    test('показывает ошибку при неверном формате', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const emailInput = screen.getByLabelText('Ваша электронная почта *');
      await user.type(emailInput, 'invalid-email');

      expect(await screen.findByText('Некорректный адрес эл. почты')).toBeInTheDocument();
    });

    test('показывает иконку успеха при корректном email', async () => {
      const user = userEvent.setup({ delay: null });
      render(<RegisterStep1 {...defaultProps} />);

      const emailInput = screen.getByLabelText('Ваша электронная почта *');
      await user.type(emailInput, 'test@example.com');

      await waitFor(() => {
        expect(screen.getByTestId('accept-icon')).toBeInTheDocument();
      });
    });
  });

  test('кнопка отправки разблокируется при заполнении всех полей корректными данными', async () => {
    const user = userEvent.setup({ delay: null });
    render(<RegisterStep1 {...defaultProps} />);

    const nameInput = screen.getByLabelText('Ваше имя *');
    const phoneInput = screen.getByLabelText('Ваш телефон *');
    const emailInput = screen.getByLabelText('Ваша электронная почта *');
    const submitButton = screen.getByTestId('mock-button-primary');

    expect(submitButton).toBeDisabled();

    await user.type(nameInput, 'Анна');
    await user.type(phoneInput, '+79991234567');
    await user.type(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('отправляет данные и вызывает onPhoneSubmit при успехе', async () => {
    const user = userEvent.setup({ delay: null });

    registerUser.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({
          success: true,
          phone: '+79991234567'
        }), 100);
      });
    });

    render(<RegisterStep1 {...defaultProps} />);

    await user.type(screen.getByLabelText('Ваше имя *'), 'Анна');
    await user.type(screen.getByLabelText('Ваш телефон *'), '+79991234567');
    await user.type(screen.getByLabelText('Ваша электронная почта *'), 'test@example.com');

    const submitButton = screen.getByTestId('mock-button-primary');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Отправка...');
    });

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(mockOnPhoneSubmit).toHaveBeenCalledWith('+79991234567');
    });
  });

  test('показывает ошибку при неудачной регистрации', async () => {
    const user = userEvent.setup({ delay: null });

    registerUser.mockRejectedValue(new Error('Пользователь уже существует'));

    render(<RegisterStep1 {...defaultProps} />);

    await user.type(screen.getByLabelText('Ваше имя *'), 'Анна');
    await user.type(screen.getByLabelText('Ваш телефон *'), '+79991234567');
    await user.type(screen.getByLabelText('Ваша электронная почта *'), 'test@example.com');

    await user.click(screen.getByTestId('mock-button-primary'));

    await waitFor(() => {
      expect(screen.queryByText('Пользователь уже существует')).toBeInTheDocument();
    });

    expect(screen.getByTestId('mock-button-primary')).not.toBeDisabled();
    expect(screen.getByTestId('mock-button-primary')).toHaveTextContent('Отправить код');
  });

   test('открывает и закрывает модальное окно с политикой', async () => {
        const user = userEvent.setup({ delay: null });
        render(<RegisterStep1 {...defaultProps} />);

        expect(screen.queryByTestId('mock-policy-modal')).not.toBeInTheDocument();

        const policyLink = screen.getByRole('button', { name: /политикой конфиденциальности/i });
        await user.click(policyLink);

        expect(screen.getByTestId('mock-policy-modal')).toBeInTheDocument();

        const closeButton = screen.getByTestId('mock-modal-close');
        await user.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByTestId('mock-policy-modal')).not.toBeInTheDocument();
        });
    });
});
