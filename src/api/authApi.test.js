import { registerUser, verifyCode, resendCode, loginUser } from "./authApi";
import { supabase } from "../utils/supabaseClient";
import { saveUserToStorage } from "../utils/authStorage";

jest.mock('../utils/supabaseClient', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn(),
            single: jest.fn(),
            upsert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis()
        }))
    }
}));

jest.mock('../utils/authStorage', () => ({
    saveUserToStorage: jest.fn()
}));

const RealDate = global.Date;

describe('authApi', () => {
    const mockPhone = '+79991234567';
    const mockCode = '1234';
    const mockUser = {
        id: '123',
        name: 'Тест',
        phone: mockPhone,
        email: 'test@test.com',
        is_verified: false,
        verification_code: mockCode,
        code_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    };

    const mockExistingUser = {
        id: '123',
        name: 'Тест',
        email: 'test@test.com',
        is_verified: true
    };

    const setupMocks = (maybeSingleReturn, singleReturn, upsertReturn, updateReturn) => {
        const mockSelect = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockMaybeSingle = jest.fn().mockResolvedValue(maybeSingleReturn || { data: null, error: null });
        const mockSingle = jest.fn().mockResolvedValue(singleReturn || { data: null, error: null });
        const mockUpsert = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(upsertReturn || { data: null, error: null })
        });
        const mockUpdate = jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue(updateReturn || { error: null })
        });

        supabase.from.mockImplementation(() => ({
            select: mockSelect,
            eq: mockEq,
            maybeSingle: mockMaybeSingle,
            single: mockSingle,
            upsert: mockUpsert,
            update: mockUpdate
        }));

        return { mockSelect, mockEq, mockMaybeSingle, mockSingle, mockUpsert, mockUpdate };
    };

    beforeEach(() => {
        jest.clearAllMocks();
        global.Date = RealDate;
    });

    describe('registerUser', () => {
        const userData = {
            name: 'Тест',
            phone: mockPhone,
            email: 'test@test.com'
        };

        test('Успешно регистрирует нового пользователя', async () => {
            const { mockUpsert } = setupMocks(
                { data: null, error: null }, // maybeSingle
                null,
                { data: [mockUser], error: null }, // upsert
                null
            );

            const result = await registerUser(userData);

            expect(result).toEqual({
                success: true,
                phone: mockPhone,
                code: mockCode
            });
            expect(supabase.from).toHaveBeenCalledWith('users');
        });

        test('Показывается ошибка, если верифицированный пользователь уже существует', async () => {
            const existingVerifiedUser = {
                id: '123',
                is_verified: true
            };

            const mockDbResponse = {
                data: existingVerifiedUser,
                error: null
            };

            setupMocks(
                mockDbResponse,
                null,
                null,
                null
            );

            await expect(registerUser(userData)).rejects.toThrow(
                'Пользователь с таким номером уже зарегистрирован!'
            );
        });

        test('Данные неверифицированного пользователя обновляются', async () => {
            const existingUnverifiedUser = {
                id: '123',
                is_verified: false,
                phone: mockPhone,
                name: 'Старое имя'
            };

            const maybeSingleResponse = {
                data: existingUnverifiedUser,
                error: null
            };

            const upsertData = [mockUser];

            const upsertResponse = {
                data: upsertData,
                error: null
            }

            setupMocks(
                maybeSingleResponse,
                null,
                upsertResponse,
                null
            );

            const result = await registerUser(userData);

            expect(result.success).toBe(true);
        });

        test('Кидает ошибку при проблеме с fetch', async () => {
            const databaseIsBroken = {
                daya: null,
                error: new Error('DB error')
            };

            setupMocks(
                databaseIsBroken,
                null,
                null,
                null
            )

            await expect(registerUser(userData)).rejects.toThrow('DB error');
        });

        test('Кидает ошибку при проблеме с upsert', async () => {
            const noUserFound = {
                data: null,
                error: null
            };

            const upsertFailed = {
                data: null,
                error: new Error('Upsert error')
            };

            setupMocks(
                noUserFound,
                null,
                upsertFailed,
                null
            );

            await expect(registerUser(userData)).rejects.toThrow('Upsert error');
        })
    });


    describe('Verify Code', () => {
        test('Успешно верифицирует код', async () => {
            const { mockUpdate } = setupMocks(
                null,
                { data: mockUser, error: null },
                null,
                { error: null }
            );

            const result = await verifyCode(mockPhone, mockCode);

            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(saveUserToStorage).toHaveBeenCalled();
        });

        test('Кидается ошибка при неверно введенном коде', async () => {
            setupMocks(
                null,
                { data: { ...mockUser, verification_code: 'wrong' }, error: null },
                null,
                null
            );

            await expect(verifyCode(mockPhone, mockCode)).rejects.toThrow('Неверный код');
        });

        test('Кидает ошибку при веедении истекшего кода', async () => {
            const pastDate = new Date(Date.now() - 60 * 60 * 1000);

            setupMocks(
                null,
                {
                    data: {
                        ...mockUser,
                        verification_code: mockCode,
                        code_expires_at: pastDate.toISOString()
                    },
                    error: null
                },
                null,
                null
            );

            await expect(verifyCode(mockPhone, mockCode)).rejects.toThrow('Код истёк');
        });

        test('Кидает ошибку при проблемах с select', async () => {
            setupMocks(
                null,
                { data: null, error: new Error('Select error') },
                null,
                null
            );

            await expect(verifyCode(mockPhone, mockCode)).rejects.toThrow('Select error');
        });

        test('Кидает ошибку при проблеме с update', async () => {
            setupMocks(
                null,
                { data: mockUser, error: null },
                null,
                { error: new Error('Update error') }
            );

            await expect(verifyCode(mockPhone, mockCode)).rejects.toThrow('Update error');
        });
    });

    describe('Resend Code', () => {
        test('Успешно отправляет новый код', async () => {
            const { mockUpdate } = setupMocks(
                null,
                null,
                null,
                { error: null }
            );

            mockUpdate.mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: null })
            });

            const result = await resendCode(mockPhone);

            expect(result).toEqual({
                success: true,
                code: mockCode
            });
        });

        test('Кидает ошибку при проблеме с update', async () => {
            const { mockUpdate } = setupMocks(
                null,
                null,
                null,
                { error: new Error('Update error') }
            );

            mockUpdate.mockReturnValue({
                eq: jest.fn().mockResolvedValue({ error: new Error('Update error') })
            });

            await expect(resendCode(mockPhone)).rejects.toThrow('Update error');
        });
    });


    describe('Login User', () => {
        test('Успешно логинит верифицированного пользователя', async () => {
            const { mockUpdate } = setupMocks(
                { data: mockExistingUser, error: null },
                null,
                null,
                null
            );

            const mockSelect = jest.fn().mockResolvedValue({
                data: [{ ...mockExistingUser, verification_code: mockCode }],
                error: null
            });

            mockUpdate.mockReturnValue({
                eq: jest.fn().mockReturnThis(),
                select: mockSelect
            });

            const result = await loginUser(mockPhone);

            expect(result).toEqual({
                success: true,
                phone: mockPhone,
                code: mockCode,
                user: mockExistingUser
            });
        });

        test('Успешно логинит неверифицированного пользователя', async () => {
            const unverifiedUser = { ...mockExistingUser, is_verified: false };

            const { mockUpdate } = setupMocks(
                { data: unverifiedUser, error: null },
                null,
                null,
                null
            );

            const mockSelect = jest.fn().mockResolvedValue({
                data: [{ ...unverifiedUser, verification_code: mockCode }],
                error: null
            });

            mockUpdate.mockReturnValue({
                eq: jest.fn().mockReturnThis(),
                select: mockSelect
            });

            const result = await loginUser(mockPhone);

            expect(result.success).toBe(true);
            expect(result.user.is_verified).toBe(false);
            //FIXME: повторная верификация пользователя дает false в  is_verified
        });

        test('Выдает ошибку, если пользователь не найден', async() => {
            setupMocks(
                { data: null, error: null },
                null,
                null,
                null
            );

            await expect(loginUser(mockPhone)).rejects.toThrow('Пользователь не найден');
        });

        test('Выдает ошибку при проблеме с fetch', async() => {
            setupMocks(
                { data: null, error: new Error('Fetch error') },
                null,
                null,
                null
            );

            await expect(loginUser(mockPhone)).rejects.toThrow('Ошибка проверки пользователя');
        })

        test('Выдает ошибку при проблеме с update', async() => {
            const { mockUpdate } = setupMocks(
                { data: mockExistingUser, error: null },
                null,
                null,
                null
            );

            const mockSelect = jest.fn().mockResolvedValue({
                data: null,
                error: new Error('Update error')
            });

            mockUpdate.mockReturnValue({
                eq: jest.fn().mockReturnThis(),
                select: mockSelect
            });

            await expect(loginUser(mockPhone)).rejects.toThrow('Не удалось отправить код. Попробуйте позже');
        });
    })
})