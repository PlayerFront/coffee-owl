import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IssueReport from './IssueReport';

delete window.location;
window.location = { href: jest.fn() };

jest.mock('../../components/CloseIcon/CloseIcon', () => ({
    __esModule: true,
    default: ({ onClose }) => (
        <button
            data-testid="mock-icon-close"
            onClick={onClose}
        >
            Закрыть
        </button>
    )
}));

jest.mock('./_issue-report.scss', () => ({}));

describe('IssueReport Component', () => {
    const mockOnClose = jest.fn();
    const defaultProps = {
        onClose: mockOnClose,
        userPhone: '+70000000000'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Рендериттся модальное окно с заголовком', () => {
        render(<IssueReport {...defaultProps} />);

        expect(screen.getByText('Сообщить о проблеме')).toBeInTheDocument();
    }); // успешно

    test('Отображаются все типы проблем', () => {
        render(<IssueReport {...defaultProps} />);

        const issueTypes = [
            'Не открывается приложение',
            'Ошибка при заказе',
            'Проблемы с оплатой',
            'Не приходит СМС код',
            'Не могу войти в приложение',
            'Проблема с товаром',
            'Другое'
        ];

        issueTypes.forEach(type => {
            expect(screen.getByText(type)).toBeInTheDocument();
        });
    });

    test('Отображаются все типы проблем в селекте', () => {
        render(<IssueReport {...defaultProps} />);

        const select = screen.getByLabelText('Тип проблемы');
        expect(select).toBeInTheDocument();

        expect(screen.getByText(/Выберите/i)).toBeInTheDocument();
        expect(screen.getByText(/Не открывается приложение/i)).toBeInTheDocument();
        expect(screen.getByText(/Ошибка при заказе/i)).toBeInTheDocument();
        expect(screen.getByText(/Не приходит СМС код/i)).toBeInTheDocument();
        expect(screen.getByText(/Не могу войти в приложение/i)).toBeInTheDocument();
        expect(screen.getByText(/Проблема с товаром/i)).toBeInTheDocument();
        expect(screen.getByText(/Другое/i)).toBeInTheDocument();
    }); // успех

    test('Кнопка отправки заблокирована до момента пока не выбран тип проблемы и описание', async () => {
        const user = userEvent.setup({ delay: null });
        render(<IssueReport {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: /Открыть почту и отправить/i });
        expect(submitButton).toBeDisabled();

        const select = screen.getByLabelText('Тип проблемы');
        await user.selectOptions(select, 'Не открывается приложение');

        expect(submitButton).toBeDisabled();

        const textArea = screen.getByLabelText('Описание проблемы');
        await user.type(textArea, 'Приложение не загружается');

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    }); // успех

    test('Вызывается mailto с корректными параметрами отправки', async () => {
        const user = userEvent.setup({ delay: null });

        const originalHref = window.location.href;

        let assignedUrl = '';

        Object.defineProperty(window, 'location', {
            value: {
                href: '',
                set href(url) {
                    assignedUrl = url;
                }
            },
            writable: true
        });

        render(<IssueReport {...defaultProps} />);

        const select = screen.getByLabelText('Тип проблемы');
        await user.selectOptions(select, 'Не открывается приложение');

        const textArea = screen.getByLabelText('Описание проблемы');
        await user.type(textArea, 'Приложение не загружается');

        const contactInput = screen.getByLabelText('Как с вами связаться?');
        await user.type(contactInput, 'test@mail.ru');

        const submitButton = screen.getByRole('button', { name: /Открыть почту и отправить/i });
        await user.click(submitButton);

        expect(assignedUrl).toBeTruthy();

        expect(assignedUrl.toLowerCase()).toContain('mailto:support@coffee-owl.ru');
        expect(decodeURIComponent(assignedUrl)).toContain('Не открывается приложение');
        expect(decodeURIComponent(assignedUrl)).toContain('Приложение не загружается');
        expect(decodeURIComponent(assignedUrl)).toContain('test@mail.ru');

        window.location.href = originalHref;
    }); //успех

    test('Компонент закрывается при нажатии на кнопку закрытия', async () => {
        const user = userEvent.setup({ delay: null });
        render(<IssueReport {...defaultProps} />);

        const closeButton = screen.getByTestId('mock-icon-close');
        expect(closeButton).toBeInTheDocument;

        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    }); // успех
})