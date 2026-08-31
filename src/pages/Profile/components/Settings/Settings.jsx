import React from "react";
import './_settings.scss';
import Button from "../../../../components/Button/Button";
import { getUserFromStorage } from "../../../../utils/authStorage";
import EditIcon from "../../../../components/EditIcon/EditIcon";
import AcceptIcon from "../../../../components/AcceptIcon/AcceptIcon";
import { useSettingsForm } from "./useSettingsForm";

const Settings = ({ onBack }) => {
    const {
        user,
        editingField,
        draftValue,
        setDraftValue,
        error,
        setError,
        startEdit,
        saveEdit,
        cancelEdit,
    } = useSettingsForm();

    const isEditing = editingField !== null;
    const isEditingName = editingField === 'name';
    const isEditingEmail = editingField === 'email';
    const isEditingBirthdate = editingField === 'birthdate';

    return (
        <section className="settings">
            <div className="settings__header">
                <h2>Настройки</h2>
            </div>

            <div className="settings__list">
                <div className={`settings__field ${isEditing && !isEditingName ? 'settings__field--disabled' : ''}`}>
                    <label className="settings__label" htmlFor="settings-name">Имя</label>
                    <div className="settings__row">
                        {isEditingName ? (
                            <>
                                <input
                                    className="settings__input"
                                    id="settings-name"
                                    value={draftValue}
                                    onChange={(e) => setDraftValue(e.target.value)}
                                    autoFocus
                                />
                                <button className="settings__action-btn" onClick={saveEdit}>
                                    <AcceptIcon />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="settings__value" >{user.name}</span>
                                <button
                                    className="settings__edit-btn"
                                    onClick={() => startEdit('name', user.name)}
                                    disabled={isEditing}
                                >
                                    <EditIcon />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className={`settings__field ${isEditing && !isEditingEmail ? 'settings__field--disabled' : ''}`}>
                    <label className="settings__label" htmlFor="settings-email">Почта</label>
                    <div className="settings__row">
                        {isEditingEmail ? (
                            <>
                                <input
                                    className={`settings__input ${error ? 'settings__input--error' : ''}`}
                                    id="settings-email"
                                    type="email"
                                    value={draftValue}
                                    onChange={(e) => {
                                        setDraftValue(e.target.value);
                                        if (error) setError('');
                                    }}
                                    autoFocus
                                />
                                <button className="settings__action-btn" onClick={saveEdit}>
                                    <AcceptIcon />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="settings__value">
                                    {user.email}
                                </span>
                                <button
                                    className="settings__edit-btn"
                                    onClick={() => startEdit('email', user.email)}
                                    disabled={isEditing}
                                >
                                    <EditIcon />
                                </button>
                            </>
                        )}
                    </div>
                    {error && <span className="settings__error">{error}</span>}
                </div>
                <div className={`settings__field ${isEditing && !isEditingBirthdate ? 'settings__field--disabled' : ''}`}>
                    <label className="settings__label" htmlFor="settings-birthdate">Дата рождения</label>
                    <div className="settings__row">
                        {isEditingBirthdate ? (
                            <>
                                <input
                                    className="settings__input"
                                    id="settings-input"
                                    type="date"
                                    value={draftValue}
                                    onChange={(e) => setDraftValue(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    autoFocus
                                />
                                <button className="settings__action-btn" onClick={saveEdit}>
                                    <AcceptIcon />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="settings__value">
                                    {user?.birthdate
                                        ? new Date(user.birthdate).toLocaleDateString('ru-RU')
                                        : 'Не указана'
                                    }
                                </span>
                                <button
                                    className="settings__edit-btn"
                                    onClick={() => startEdit('birthdate', user?.birthdate || '')}
                                    disabled={isEditing}
                                >
                                    <EditIcon />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className='order-history__footer'>
                <Button
                    size='large'
                    variant='secondary'
                    onClick={onBack}
                >
                    Назад</Button>
            </div>
        </section>
    );
};

export default Settings;
