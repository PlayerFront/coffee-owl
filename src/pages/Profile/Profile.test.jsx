import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Profile from "./Profile";
import { getUserFromStorage } from "../../utils/authStorage";

jest.mock('../../utils/supabaseClient', () => ({
    supabase: {
        from: jest.fn(() => ({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        })),
    },
}));

jest.mock('../../utils/authStorage', () => ({
    getUserFromStorage: jest.fn(() => ({
        name: 'User',
        phone: '+70000000000',
    })),
}));

jest.mock('../../components/AvatarIcon/AvatarIcon', () => () => <span>Иконка профиля</span>);
jest.mock('../../components/OrdersIcon/OrdersIcon', () => () => <span>Иконка заказов</span>);
jest.mock('../../components/SettingsIcon/SettingsIcon', () => () => <span>Иконка настроек</span>);
jest.mock('../../components/TechSupportIcon/TechSupportIcon', () => () => <span>Иконка техподдержки</span>);
jest.mock('../../components/ContactsIcon/ContactsIcon', () => () => <span>Иконка контактов</span>);
jest.mock('../../components/LogoutIcon/LogoutIcon', () => () => <span>Иконка выхода</span>);

describe('Profile', () => {
    const defaultProps = {
        onLogout: jest.fn(),
        onTabChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Отображается имя пользователя', () => {
        render(<Profile {...defaultProps} />);
        expect(screen.getByText('User')).toBeInTheDocument();
    });

    test('Отображается номер телефона', () => {
        render(<Profile {...defaultProps} />);
        expect(screen.getByText('+70000000000')).toBeInTheDocument();
    });

    test('Рендерится автар пользователя', () => {
        render(<Profile {...defaultProps} />);
        expect(screen.getByText('Иконка профиля')).toBeInTheDocument();
    })

    test('Отображаются все пункты меню', () => {
        render(<Profile {...defaultProps} />);
        expect(screen.getByText('Мои заказы')).toBeInTheDocument();
        expect(screen.getByText('Настройки')).toBeInTheDocument();
        expect(screen.getByText('Техподдержка')).toBeInTheDocument();
        expect(screen.getByText('Контакты')).toBeInTheDocument();
        expect(screen.getByText('Выйти')).toBeInTheDocument();
    });

    test('Кнопка Мои заказы вызывает onTabChange с orders', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Мои заказы'));
        expect(screen.getByText('Мои заказы')).toBeInTheDocument();
        expect(screen.queryByText('Настройки')).not.toBeInTheDocument();
    });

    test('Кнопка Настройки вызывает onTabChange с settings', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Настройки'));
        expect(defaultProps.onTabChange).toHaveBeenCalledWith('settings');
    });

    test('Кнопка Техподдержка вызывает onTabChange с support', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Техподдержка'));
        expect(defaultProps.onTabChange).toHaveBeenCalledWith('support');
    });

    test('Кнопка Контакты вызывает onTabChange с contacts', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Контакты'));
        expect(defaultProps.onTabChange).toHaveBeenCalledWith('contacts');
    });

    test('Кнопка Выйти вызывает onLogout', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Выйти'));
        expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });
});