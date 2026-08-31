import { render, act, waitFor, renderHook } from "@testing-library/react";
import { useSettingsForm } from "../useSettingsForm";
import { getUserFromStorage, saveUserToStorage } from "../../../../../utils/authStorage";
import { updateUserProfile } from "../../../../../api/authApi";

jest.mock('../../../../../utils/authStorage', () => ({
    getUserFromStorage: jest.fn(() => ({
        id: 10, 
        name: 'User',
        phone: '+70000000000',
        email: 'example@email.com',
        birthdate: null,
    })),
    saveUserToStorage: jest.fn(),
}));

jest.mock('../../../../../api/authApi', () => ({
    updateUserProfile: jest.fn(),
}));

describe('useSettingsForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Возвращается дефолтный юзер', () => {
        const { result } = renderHook(() => useSettingsForm());
        expect(result.current.user.name).toBe('User');
    });

    test('startEdit устанавливает editingField и draftValue', () => {
        const { result } = renderHook(() => useSettingsForm());

        act(() => {
            result.current.startEdit('name', 'User');
        });

        expect(result.current.editingField).toBe('name');
        expect(result.current.draftValue).toBe('User');
    });

    test('cancelEdit сбрасывает состояние', () => {
        const { result } = renderHook(() => useSettingsForm());


        act(() => {
            result.current.startEdit('name', 'User');
        });

        act(() => {
            result.current.cancelEdit();
        });

        expect(result.current.editingField).toBeNull();
        expect(result.current.draftValue).toBe('');
    });

    test('saveEdit сохраняет данные на сервер и в локльное хранилище', async () => {
        updateUserProfile.mockResolvedValue({ id: 10, name: 'NewName'});

        const { result } = renderHook(() => useSettingsForm());

        act(() => { 
            result.current.startEdit('name', 'User');
            result.current.setDraftValue('NewName');
        });

        await act(async () => {
            await result.current.saveEdit();
        });

        expect(updateUserProfile).toHaveBeenCalledWith(10, { name: 'NewName'});
        expect(saveUserToStorage).toHaveBeenCalled();
        expect(result.current.editingField).toBeNull();
    });

    test('saveEdit показывает ошибку при невалидном email', async () => {
        const { result } = renderHook(() => useSettingsForm());

        act(() => {
            result.current.startEdit('email', 'example@email.com');
            result.current.setDraftValue('bad-email');
        });

        await act(async () => {
            await result.current.saveEdit();
        });

        expect(result.current.error).toBe('Некорректный адрес эл. почты');
        expect(updateUserProfile).not.toHaveBeenCalled();
    });

    test('saveEdit не сохраняет если нет editingField', async () => {
        const { result } = renderHook(() => useSettingsForm());


        await act(async () => {
            await result.current.saveEdit();
        });

        expect(updateUserProfile).not.toHaveBeenCalled();
    });
})