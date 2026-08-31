import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Settings from '../Settings';
import { useSettingsForm } from "../useSettingsForm";

const mockStartEdit = jest.fn();
const mockSaveEdit = jest.fn();
const mockCancelEdit = jest.fn();
const mockSetDraftValue = jest.fn();

jest.mock('../useSettingsForm', () => ({
    useSettingsForm: jest.fn()
}));

jest.mock('../../../../../components/Button/Button', () => {
    return function MockButton({ children, onClick, variant, size }) {
        return <button onClick={onClick} data-variant={variant}>{children}</button>
    };
});

jest.mock('../../../../../components/EditIcon/EditIcon', () => () => <span>Иконка редактирования</span>);
jest.mock('../../../../../components/AcceptIcon/AcceptIcon', () => () => <span>Иконка сохранения</span>);

const defaultUser = {
    name: 'User',
    phone: '+70000000000',
    email: 'example@email.com',
    birthdate: '1995-06-15', //null
}

describe('Settings', () => {
    const mockOnBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useSettingsForm.mockReturnValue({
            user: defaultUser,
            editingField: null,
            draftValue: '',
            setDraftValue: mockSetDraftValue,
            error: '',
            startEdit: mockStartEdit,
            saveEdit: mockSaveEdit,
            cancelEdit: mockCancelEdit,
        });
    });

    test('Рендерится заголовок Настройки', () => {
        render(<Settings onBack={mockOnBack} />);
        expect(screen.getByText('Настройки')).toBeInTheDocument();
    });

    test('Рендерится кнопка Назад, кнопка Назад вызывает onBack', () => {
        render(<Settings onBack={mockOnBack} />);
        expect(screen.getByText('Назад')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Назад'));
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    test('Отображается имя пользователя, его почту', () => {
        render(<Settings onBack={mockOnBack} />);
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('example@email.com')).toBeInTheDocument();
    });

    test('Режим редактирования: отображается input с кнопкой сохранения', () => {
        useSettingsForm.mockReturnValue({
            user: defaultUser,
            editingField: 'name',
            draftValue: 'User',
            setDraftValue: mockSetDraftValue,
            error: '',
            startEdit: mockStartEdit,
            saveEdit: mockSaveEdit,
            cancelEdit: mockCancelEdit,
        });

        render(<Settings onBack={mockOnBack} />);

        const input = screen.getByDisplayValue('User');
        expect(input).toBeInTheDocument();
        expect(screen.getByText('Иконка сохранения')).toBeInTheDocument();
    });

    test('Другие поля блокируются при редактировании', () => {
        useSettingsForm.mockReturnValue({
            user: defaultUser,
            editingField: 'name',
            draftValue: 'User',
            setDraftValue: mockSetDraftValue,
            error: '',
            startEdit: mockStartEdit,
            saveEdit: mockSaveEdit,
            cancelEdit: mockCancelEdit,
        });

        render(<Settings onBack={mockOnBack} />);

        const editButtons = screen.getAllByRole('button').filter(
            btn => btn.querySelector('span')?.textContent === 'Иконка редактирования'
        );

        editButtons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    test('Отображается ошибка при невалидном email', () => {
        useSettingsForm.mockReturnValue({
            user: defaultUser,
            editingField: 'email',
            draftValue: 'bad-email',
            setDraftValue: mockSetDraftValue,
            error: 'Некорректный адрес эл.почты',
            startEdit: mockStartEdit,
            saveEdit: mockSaveEdit,
            cancelEdit: mockCancelEdit,
        });

        render(<Settings onBack={mockOnBack} />);
        expect(screen.getByText('Некорректный адрес эл.почты')).toBeInTheDocument();
    });

    test('Показывает Не указано когда дата рождения null', () => {
        useSettingsForm.mockReturnValue({
            user: {...defaultUser, birthdate: null },
            editingField: null,
            draftValue: '',
            setDraftValue: mockSetDraftValue,
            error: '',
            setError: jest.fn(),
            startEdit: mockStartEdit,
            saveEdit: mockSaveEdit,
            cancelEdit: mockCancelEdit,
        });

        render(<Settings onBack={mockOnBack} />);
        expect(screen.getByText('Не указана')).toBeInTheDocument();
    });

    test('Показывается дата рождения в формате ДД.ММ.ГГГГ', () => {
        render(<Settings onBack={mockOnBack} />);

        expect(screen.getByText('15.06.1995')).toBeInTheDocument();
    });
});