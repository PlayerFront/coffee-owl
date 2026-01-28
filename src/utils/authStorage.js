const USER_KEY = 'coffee_owl_user';
const SESSION_KEY = 'coffee_owl_session';

export const saveUserToStorage = (userData) => {
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения пользователя', error);
        return false;
    }
};

export const getUserFromStorage = () => {
    try {
        const userData = localStorage.getItem(USER_KEY);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Ошибка чтения пользователя', error);
        return null;
    }
}

export const removeUserFromStorage = () => {
    try {
        localStorage.removeItem(USER_KEY);
        return true;
    } catch (error) {
        console.error('Ошибка удаления пользователя', error);
        return false;
    }
};

export const isUserAuthenticated = () => {
    const user = getUserFromStorage();
    return user && user.is_verified === true;
}

export const saveSession = (sessionData) => {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            ...sessionData,
            lastActivity: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Ошибка сохранения сессии');
    }
}

export const getSession = () => {
    try {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Ошибка чтения сессии', error);
        return null;
    }
}