import { supabase } from "../../utils/supabaseClient";
import { createOrder, getUserOrders } from "../orderApi";

// jest.mock('../../utils/supabaseClient', () => ({
//     supabase: {
//         from: jest.fn().mockReturnThis(),
//         insert: jest.fn().mockReturnThis(),
//         select: jest.fn().mockReturnThis(),
//         eq: jest.fn().mockReturnThis(),
//         order: jest.fn().mockReturnThis(),
//     },
// }));

const mockDb = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
};

jest.mock('../../utils/supabaseClient', () => ({
    supabase: {
        from: jest.fn(() => mockDb),
    },
}));

describe('orderApi', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        test('Успешно создает заказ и возвращает данные', async () => {
            const mockOrder = {
                id: '123',
                user_id: 10,
                items: [{ id: 1, name: 'Капучино', price: 220, quantity: 1 }],
                total_price: 220,
                pickup_time: '14:30:00',
                payment_method: 'cash',
                status: 'pending',
                display_id: 'CWL-06482',
            };

            // supabase
            mockDb.select.mockResolvedValue({ data: [mockOrder], error: null });

            const result = await createOrder(
                10,
                [{ id: 1, name: 'Капучино', price: 220, quantity: 1 }],
                220,
                '14:30:00',
                'cash'
            );

            expect(result).toEqual(mockOrder);
        });

        test('Выбрасывается ошибка, если user ID не передан', async () => {
            await expect(createOrder(null, [], 100, '14:30', 'cash'))
                .rejects.toThrow('User ID is required');
        });

        test('Выбрасывается ошибка, если корзина пуста', async () => {
            await expect(createOrder(10, [], 100, '14:30', 'cash'))
                .rejects.toThrow('Cart is empty');
        });

        test('Выбрасывается ошибка, если не указано время', async () => {
            await expect(createOrder(10, [{ is: 1 }], 100, null, 'cash'))
                .rejects.toThrow('Pickup time is required');
        });

        test('Выбрасывается ошибка при проблеме с supabase', async () => {
            mockDb.select.mockResolvedValue({
                data: null,
                error: { message: 'Database error' }
            });

            await expect(createOrder(10, [{ id: 1 }], 100, '14:30', 'cash'))
                .rejects.toThrow('Failed to create order');
        });

        test('Генерируется display_id в формате CWL-XXXXX', async () => {
            const mockOrder = {
                id: '123',
                display_id: 'CWL-06482',
            };

            mockDb.select.mockResolvedValue({ data: [mockOrder], error: null });

            const result = await createOrder(10, [{ id: 1 }], 100, '14:30', 'cash');

            expect(result.display_id).toMatch(/^CWL-\d{5}$/);

        });
    });

    describe('getUserOrder', () => {
        test('Возвращается список заказов пользователя', async () => {

            mockDb.select.mockReturnThis();
            mockDb.eq.mockReturnThis();

            const mockOrders = [
                { id: '1', user_id: 10, total_price: 220 },
                { id: '2', user_id: 10, total_price: 370 },
            ];

            mockDb.order.mockResolvedValue({ data: mockOrders, error: null });

            const result = await getUserOrders(10);

            expect(result).toEqual(mockOrders);
        });

        test('Выбрасывается ошибка при проблеме с supabase', async () => {
            mockDb.order.mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
            });

            await expect(getUserOrders(10))
                .rejects.toThrow('Failed to fetch orders');
        });

        test('Выбрасывается ошибка если userId не передан', async () => {
            await expect(getUserOrders(null))
                .rejects.toThrow('User ID is required');
        });
    });
});