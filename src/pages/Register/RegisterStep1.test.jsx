import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import RegisterStep1 from "./RegisterStep1";


jest.mock('./_register-step1.scss', () => ({}));

jest.mock('../../components/Button/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, disabled, type = 'button' }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid="mock-button"
    >
      {children}
    </button>
  )
}));

jest.mock('../../components/AcceptIcon/AcceptIcon', () => ({
  __esModule: true,
  default: () => <span data-testid="mock-accept-icon">✓</span>
}));

jest.mock('../../api/authApi', () => ({
  registerUser: jest.fn(() => Promise.resolve({
    success: true,
    phone: '+70000000000',
    code: '1234'
  }))
}));

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useForm: jest.fn(() => ({
      register: (name, options) => ({
        name,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn()
      }),
      handleSubmit: (callback) => (e) => {
        e?.preventDefault?.();
        callback({
          name: 'Тест',
          phone: '+70000000000',
          email: 'test@test.com'
        });
      },
      formState: { errors: {}, isValid: true, isSubmitting: false },
      watch: jest.fn((field) => {
        const values = {
          name: 'Тест',
          phone: '+70000000000',
          email: 'test@test.com'
        };

        if (typeof field === 'string') return values[field] || '';
        if (Array.isArray(field)) return field.map(f => values[f] || '');
        return '';
      }),
      control: {},
      setValue: jest.fn(),
      getValues: jest.fn(() => ({
        name: 'Тест',
        phone: '+70000000000',
        email: 'test@test.com'
      }))
    })),
    Controller: ({ render, name }) =>
      render({
        field: { name, value: '', onChange: jest.fn(), onBlur: jest.fn() },
        fieldState: { error: null }
      })
  };
});

describe('RegisterStep1 component', () => {
  const mockOnNavigate = jest.fn();
  const mockOnPhoneSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getProps = () => ({
    onNavigate: jest.fn(),
    onPhoneSubmit: jest.fn()
  }); //!!!!!!!!!!!!!!!

  test('Рендер происходит без ошибок', () => {
    const { container } = render(
      <RegisterStep1
        onNavigate={mockOnNavigate}
        onPhoneSubmit={mockOnPhoneSubmit}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('Содержится заголовок регистрация', () => {
    render(
      <RegisterStep1
        onNavigate={mockOnNavigate}
        onPhoneSubmit={mockOnPhoneSubmit}
      />
    );
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  test('Рендерит все поля формы', () => {
    render(
      <RegisterStep1
        onNavigate={mockOnNavigate}
        onPhoneSubmit={mockOnPhoneSubmit}
      />
    );

    expect(screen.getByLabelText(/ваше имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ваш телефон/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ваша электронная почта/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отправить код/i })).toBeInTheDocument();
  });

  test('кнопка активна при валидной форме', () => {
    render(
      <RegisterStep1
        onNavigate={mockOnNavigate}
        onPhoneSubmit={mockOnPhoneSubmit}
      />
    );

    const button = screen.getByRole('button', { name: /отправить код/i });
    expect(button).not.toBeDisabled();
  });

// TODO:добавить больше глубоких тестов
});