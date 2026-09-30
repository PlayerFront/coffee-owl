import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import CoffeeLoad from "../CoffeeLoad/CoffeeLoad";

describe('CoffeeLoad component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Рендерится заголовок Загруженность кофейни', () => {
        jest.setSystemTime(new Date('2026-09-30T15:00:00'));
        render(<CoffeeLoad />);
        expect(screen.getByText('Загруженность кофейни')).toBeInTheDocument();
    });

    test('Рендерятся 13 столбиков', () => {
        jest.setSystemTime(new Date('2026-09-30T15:00:00'));
        render(<CoffeeLoad />);
        const bars = document.querySelectorAll('.coffee-load__bar');
        expect(bars).toHaveLength(13);
    });

    test('Отображается свободно при низкой загруженности, value <= 2', () => {
        jest.setSystemTime(new Date('2026-09-30T15:00:00'));
        render(<CoffeeLoad />);
        expect(screen.queryByText(/свободно/)).toBeInTheDocument();
    });

    test('Отображается умеренная загруженность при средней загруженности, value === 3', () => {
        jest.setSystemTime(new Date('2026-09-30T10:00:00'));
        render(<CoffeeLoad />);
        expect(screen.queryByText(/умеренная загруженность/)).toBeInTheDocument();
    });

    test('Отображается высокая загруженность при пике, value > 3', () => {
        jest.setSystemTime(new Date('2026-09-30T11:00:00'));
        render(<CoffeeLoad />);
        expect(screen.queryByText(/высокая загруженность/)).toBeInTheDocument();
    });

    test('Отображается надпись кофейня закрыта до 9 утра', () => {
        jest.setSystemTime(new Date('2026-09-30T07:00:00'));
        render(<CoffeeLoad />);
        expect(screen.queryByText(/Кофейня закрыта/)).toBeInTheDocument();
    });

    test('Отображается надпись кофейня закрыта после 21 вечера', () => {
        jest.setSystemTime(new Date('2026-09-30T23:00:00'));
        render(<CoffeeLoad />);
        expect(screen.queryByText(/Кофейня закрыта/)).toBeInTheDocument();
    });

    test('Активный столбик соответствует текущему часу', () => {
        jest.setSystemTime(new Date('2026-09-30T15:00:00'));
        render(<CoffeeLoad />);

        const activeBars = document.querySelectorAll('.coffee-load__bar--active');
        expect(activeBars).toHaveLength(1);

        const chart = document.querySelector('.coffee-load__chart');
        const columns = document.querySelectorAll('.coffee-load__column');
        const activeColumn = columns[6];
        expect(activeColumn.querySelector('.coffee-load__bar--active')).toBeInTheDocument();
    });
});