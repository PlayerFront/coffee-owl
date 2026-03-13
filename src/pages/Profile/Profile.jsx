import React from 'react';
import Button from '../../components/Button/Button';

const Profile = ({ onLogout }) => {
    return (
        <div className='profile'>
            <h1>Профиль</h1>
            <p>Информация о пользователе</p>
            <Button
                onClick={onLogout}
                variant='primary'
                size='large'
            >
                Выйти
            </Button>
        </div>
    );
};

export default Profile;