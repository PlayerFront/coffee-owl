import { useEffect, useState } from "react";
import { getUserFromStorage, saveUserToStorage } from "../../../../utils/authStorage";
import { updateUserProfile } from "../../../../api/authApi";

export const useSettingsForm = () => {
    
    const [user, setUser] = useState(getUserFromStorage());
    const [editingField, setEditingField] = useState(null);
    const [draftValue, setDraftValue] = useState('');
    const [error, setError] = useState('');

    const cancelEdit = () => {
        setEditingField(null);
        setDraftValue('');
        setError('')
    };

    useEffect(() => {
        if (!editingField) return;
        const handleClickOutside = (e) => {
            const clickInside = e.target.closest('.settings__input, .settings__action-btn, .settings__edit-btn');

            if (!clickInside) {
                cancelEdit();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);;
        }
    }, [editingField]);

    const startEdit = (field, currentValue) => {
        setEditingField(field);
        setDraftValue(currentValue);
        setError('');
    };

    const saveEdit = async () => {
        if (editingField && user?.id) {
            if (editingField === 'email' && draftValue.trim()) {
                const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (!emailRegex.test(draftValue.trim())) {
                    setError('Некорректный адрес эл. почты');
                    return;
                }
            }

            try {
                await updateUserProfile(user.id, { [editingField]: draftValue });
                const updatedUser = { ...user, [editingField]: draftValue };
                saveUserToStorage(updatedUser);
                setUser(updatedUser);
                setEditingField(null);
                setDraftValue('');
                setError('');
            } catch (err) {
                console.error('Ошибка сохранения:', err);
                setError('Не удалось обновить профиль');
            }
        }
    };

    return {
        user,
        editingField,
        draftValue,
        setDraftValue,
        error,
        setError,
        startEdit,
        saveEdit,
        cancelEdit,
    };
};

