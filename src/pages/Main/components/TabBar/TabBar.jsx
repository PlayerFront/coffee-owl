import React from "react";
import './_tab-bar.scss';
import HomeIcon from '../../../../components/HomeIcon/HomeIcon';
import CatalogIcon from "../../../../components/CatalogIcon/CatalogIcon";
import CartIcon from "../../../../components/CartIcon/CartIcon";
import ProfileIcon from "../../../../components/ProfileIcon/ProfileIcon";

const tabs = [
    { id: 'home', label: 'Главная', icon: HomeIcon },
    { id: 'catalog', label: 'Каталог', icon:  CatalogIcon },
    { id: 'cart', label: 'Корзина', icon: CartIcon },
    { id: 'profile', label: 'Профиль', icon: ProfileIcon }
];

const TabBar = ({ activeTab, onTabChange }) => {
    return (
        <section className='tab-bar'>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-bar__button ${activeTab === tab.id ? 'tab-bar__button--active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.icon && <tab.icon active={activeTab === tab.id} />}
                    <span className="tab-bar__label">{tab.label}</span>
                </button>
            ))}
        </section>
    );
};

export default TabBar;