import React, { useState } from 'react';
import Button from '../../components/Button/Button'; // кнопка выйти
import './_profile.scss';
import { getUserFromStorage } from '../../utils/authStorage';
import AvatarIcon from '../../components/AvatarIcon/AvatarIcon';
import OrdersIcon from '../../components/OrdersIcon/OrdersIcon';
import SettingsIcon from '../../components/SettingsIcon/SettingsIcon';
import TechSupportIcon from '../../components/TechSupportIcon/TechSupportIcon';
import ContactsIcon from '../../components/ContactsIcon/ContactsIcon';
import LogoutIcon from '../../components/LogoutIcon/LogoutIcon';
import OrderHistory from './components/OrderHistory/OrderHistory';

const Profile = ({ onLogout, onTabChange }) => {
    const [activeView, setActiveView] = useState('menu');

    const user = getUserFromStorage();
    const phone = user?.phone;
    const name = user?.name;

    const menuItems = [
        {
            icon: <OrdersIcon />,
            label: 'Мои заказы',
            action: () => setActiveView('orders'),
        },
        {
            icon: <SettingsIcon />,
            label: 'Настройки',
            action: () => onTabChange?.('settings'),
        },
        {
            icon: <TechSupportIcon />,
            label: 'Техподдержка',
            action: () => onTabChange?.('support')
        },
        {
            icon: <ContactsIcon />,
            label: 'Контакты',
            action: () => onTabChange?.('contacts'),
        },
        {
            icon: <LogoutIcon />,
            label: 'Выйти',
            action: () => onLogout(),
        }
    ];

    if (activeView === 'orders') {
        return (
            <OrderHistory onBack={() => setActiveView('menu')} />
        );
    }

    return (
        <section className='profile'>
            <header className='profile__header'>
                <div className='profile__info'>
                    <h2 className='profile__name'>{name}</h2>
                    <p className='profile__phone'>{phone}</p>
                </div>
                <div className='profile__avatar'>
                    <AvatarIcon />
                </div>
            </header>
            <div className='profile__menu'>
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className='profile__menu-item'
                        onClick={item.action}
                    >
                        <span className="profile__menu-icon">{item.icon}</span>
                        <span className="profile__menu-label">{item.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default Profile;