import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Landing from "../Landing";


jest.mock('../../../assets/icons/StartPage/startPageIcon.webp', () => 'logo-mock');
jest.mock('../../../assets/icons/StartPage/startPageTitleIcon.webp', () => 'title-mock');

jest.mock('../components/InstallGuideModal/InstallGuideModal', () => {
    return function MockModal({ onClose }) {
        return (
            <div data-testid="install-guide">
                <button onClick={onClose}>Закрыть</button>
            </div>
        );
    };
});

describe('Landing', () => {
    const mockOnOpen = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится логотип кофейни и заголовок с названием кофейни', () => {
        render(<Landing onOpen={mockOnOpen} />);
        expect(screen.getByAltText('Coffee Owl - логотип кофейни')).toBeInTheDocument();
        expect(screen.getByAltText('Coffee Owl - название кофейни')).toBeInTheDocument();
    });

    test('Рендерится текст описания', () => {
        render(<Landing onOpen={mockOnOpen} />);
        expect(screen.getByText('Заказ можно сделать только через приложение кофейни')).toBeInTheDocument();
    });

    test('Рендерятся две кнопки', () => {
        render(<Landing onOpen={mockOnOpen} />);
        expect(screen.getByText('Открыть в приложении')).toBeInTheDocument();
        expect(screen.getByText('Установить приложение')).toBeInTheDocument();
    });

    test('Кнопка Открыть в приложении вызывает onOpen', () => {
        render(<Landing onOpen={mockOnOpen} />);
        fireEvent.click(screen.getByText('Открыть в приложении'));
        expect(mockOnOpen).toHaveBeenCalledTimes(1);
    });

    test('Модальное окно скрыто', () => {
        render(<Landing onOpen={mockOnOpen} />);
        expect(screen.queryByTestId('install-guide')).not.toBeInTheDocument();
    });

    test('После клика на кнопку установить приложение открывается модальное окно, если нет defferedPrompt', () => {
        render(<Landing onOpen={mockOnOpen} />);
        fireEvent.click(screen.getByText('Установить приложение'));
        expect(screen.getByTestId('install-guide')).toBeInTheDocument();
    });

    test('Закрытие модального окна скрывает его', () => {
        render(<Landing onOpen={mockOnOpen} />);
        fireEvent.click(screen.getByText('Установить приложение'));
        expect(screen.getByTestId('install-guide')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Закрыть'));
        expect(screen.queryByTestId('install-guide')).not.toBeInTheDocument();
    });
});