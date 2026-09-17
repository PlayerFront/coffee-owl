import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Support from "../Support";


jest.mock('../SupportFAQ/SupportFAQ', () => {
    return function MockFAQ({ onBack }) {
        return (
            <div>
                <h2>Частые вопросы</h2>
                <button onClick={onBack}>Назад</button>
            </div>
        );
    };
});

jest.mock('../../../../../components/IssueReport/IssueReport', () => {
    return function MockIssueReport({ onClose }) {
        return (
            <div data-testid="issue-report">
                <button onClick={onClose}>Отмена</button>
            </div>
        );
    };
});

jest.mock('../../../../../components/TechSupportIcon/TechSupportIcon', () => () => <span>Иконка техподдержки</span>);
jest.mock('../../../../../components/CoffeeBeanIcon/CoffeeBeanIcon', () => () => <span>Иконка кофейного зерна</span>);

describe('Support element', () => {
    const mockOnBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендерится заголовок Техподдержка', () => {
        render(<Support onBack={mockOnBack} />);
        expect(screen.getByText('Техподдержка')).toBeInTheDocument();
    });

    test('Рендерятся два пункта меню', () => {
        render(<Support onBack={mockOnBack} />);
        expect(screen.getByText('Частые вопросы')).toBeInTheDocument();
        expect(screen.getByText('Сообщить о проблеме')).toBeInTheDocument();
    });

    test('Кнопка Назад вызывает onBack', () => {
        render(<Support onBack={mockOnBack} />);
        fireEvent.click(screen.getByText('Назад'));
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    test('Клик на Частые вопросы открывает SupportFAQ', () => {
        render(<Support onBack={mockOnBack} />);
        fireEvent.click(screen.getByText('Частые вопросы'));

        expect(screen.queryByText('Техподдержка')).not.toBeInTheDocument();
        expect(screen.getByText('Частые вопросы')).toBeInTheDocument();
    });

    test('Клик на Сообщить о проблеме вызывает модалку ', () => {
        render(<Support onBack={mockOnBack} />);
        expect(screen.queryByTestId('issue-report')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Сообщить о проблеме'));

        expect(screen.getByTestId('issue-report')).toBeInTheDocument();
    });

    test('Закрытие модалки возвращает в меню Поддержки', () => {
        render(<Support onBack={mockOnBack} />);
        fireEvent.click(screen.getByText('Сообщить о проблеме'));
        fireEvent.click(screen.getByText('Отмена'));

        expect(screen.queryByTestId('issue-report')).not.toBeInTheDocument();
        expect(screen.getByText('Техподдержка')).toBeInTheDocument();
    });
});