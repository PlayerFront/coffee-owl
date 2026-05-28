import { renderHook, waitFor } from "@testing-library/react";
import { useUserOrders } from "../useOrders";
import { getUserFromStorage } from "../../utils/authStorage";
import { getUserOrders } from "../../api/orderApi";

jest.mock('../../utils/authStorage', () => ({
    getUserFromStorage: jest.fn(),
}));

jest.mock('../../api/orderApi', () => ({
    getUserOrders: jest.fn(),
}));

describe('useUserOrders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Возвращается loading=true в начале', () => {
        getUserFromStorage.mockReturnValue({ id: 10 });
        getUserOrders.mockReturnValue(new Promise(() => {}));

        const { result } = renderHook(() => useUserOrders());

        expect(result.current.loading).toBe(true);
        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    test('Возвращает заказы после успешной загрузки', async () => {
        const mockOrders = [
            { id: '1', display_id: 'CWL-06482', total_price: 370 },
            { id: '2', display_id: 'CWL-06483', total_price: 220 },
        ];

        getUserFromStorage.mockReturnValue({ id: 10 });
        getUserOrders.mockResolvedValue(mockOrders);

        const { result } = renderHook(() => useUserOrders());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toEqual(mockOrders);
        expect(result.current.error).toBeNull();
    });

    test('Возвращает ошибку, если пользователь не авторизован', async () => {
        getUserFromStorage.mockReturnValue(null);

        const { result } = renderHook(() => useUserOrders());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBe('Пользователь не авторизован');
    });

    test('Возвращается ошибка, если у пользователя нет id', async() => {
        getUserFromStorage.mockReturnValue({});

        const { result } = renderHook(() => useUserOrders());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Пользователь не авторизован');
    });

    test('Возвращается ошибка при проблеме с API', async() => {
        getUserFromStorage.mockReturnValue({ id: 10 });
        getUserOrders.mockRejectedValue(new Error('Сетевая ошибка'));

        const { result } = renderHook(() => useUserOrders());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.orders).toEqual([]);
        expect(result.current.error).toBe('Сетевая ошибка');
    });

    test('Вызывается getUserOrders с правильным userId', async () => {
        getUserFromStorage.mockReturnValue({ id: 10 });
        getUserOrders.mockResolvedValue([]);

        renderHook(() => useUserOrders());

        await waitFor(() => {
            expect(getUserOrders).toHaveBeenCalledWith(10);
        });
    });
});