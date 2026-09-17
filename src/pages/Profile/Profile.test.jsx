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
jest.mock('../../components/CoffeeBeanIcon/CoffeeBeanIcon', () => () => <span>Иконка кофейного зерна</span>);
jest.mock('../../components/EditIcon/EditIcon', () => () => <span>Иконка редактирования</span>);
jest.mock('../../components/LocationIcon/LocationIcon', () => () => <span>Иконка локации</span>);
jest.mock('../../components/ClockIcon/ClockIcon', () => () => <span>Иконка часов</span>);

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

    test('Кнопка Мои заказы показывает заказы пользователя', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Мои заказы'));
        expect(screen.getByText('Назад')).toBeInTheDocument();
        expect(screen.queryByText('Настройки')).not.toBeInTheDocument();
    });

    test('Кнопка Настройки показывает страницу настроек', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Настройки'));

        expect(screen.getByText('Имя')).toBeInTheDocument();
        expect(screen.queryByText('Мои заказы')).not.toBeInTheDocument();
    });

    test('Кнопка Техподдержка показывает страницу поддержки', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Техподдержка'));

        expect(screen.getByText('Частые вопросы')).toBeInTheDocument();
        expect(screen.queryByText('Мои заказы')).not.toBeInTheDocument();
    });

    test('Кнопка Контакты показывает страницу с контактами кофейни', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Контакты'));

        expect(screen.getByText('Адрес')).toBeInTheDocument();
        expect(screen.queryByText('Мои заказы')).not.toBeInTheDocument();
    });

    test('Кнопка Выйти вызывает onLogout', () => {
        render(<Profile {...defaultProps} />);
        fireEvent.click(screen.getByText('Выйти'));
        expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
    });
});