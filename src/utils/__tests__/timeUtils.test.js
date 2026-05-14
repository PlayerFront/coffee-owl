import { getAvailableTimes, formatTimeForDB } from "../timeUtils";

describe('timeUtils', () => {
    describe('formatTimeForDB', () => {
        test('Добавляет секунды ко времени', () => {
            expect(formatTimeForDB('14:30')).toBe('14:30:00');
        });

        test('Работает с полночью', () => {
            expect(formatTimeForDB('00:00')).toBe('00:00:00');
        });
    });

    describe('getAvalaibleTimes', () => {
        test('Возвращает доступное время для заказа с шагом в 30 минут', () => {
            const times = getAvailableTimes(new Date('2026-05-06T09:05:00'));
            expect(times.length).toBeGreaterThan(0);
            expect(times[0]).toBe('09:30');
            expect(times[1]).toBe('10:00');
        });

        test('Если настоящее время 09:31, первый слот вернет 10:00', () => {
            const times = getAvailableTimes(new Date('2026-05-06T09:31:00'));
            expect(times[0]).toBe('10:00');
        });

        // test('После 21:30 и позднее возвращает пустой массив', () => {
        //     const times = getAvailableTimes(new Date('2026-05-06T21:30:00'));
        //     expect(times).toEqual([]);
        // });

        test('в 21:00 ещё есть слоты', () => {
            const times = getAvailableTimes(new Date('2026-05-06T21:00:00'));
            expect(times.length).toBeGreaterThan(0);
            expect(times[times.length - 1]).toBe('21:30');
        });

        test('Ранним утром до 9:00 слоты начинаются с 9:00', () => {
            const times = getAvailableTimes(new Date('2026-05-06T07:15:00'));
            expect(times[0]).toBe('09:00');
        });

        test('Все времена в читаемом для пользователя формате ЧЧ:ММ', () => {
            const times = getAvailableTimes(new Date('2026-05-06T12:00:00'));
            times.forEach(time => {
                expect(time).toMatch(/^\d{2}:\d{2}$/);
            });
        });

        test('Времена идут по возрастанию', () => {
            const times = getAvailableTimes(new Date('2026-05-06T12:00:00'));
            for (let i = 1; i < times.kength; i++) {
                expect(times[i] > times[i - 1]).toBe(true);
            }
        });
    })
})