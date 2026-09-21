import React from "react";
import { useState } from "react";
import Home from "../../../Home/Home";
import Catalog from "../../../Catalog/Catalog";
import Cart from "../../../Cart/Cart";
import Profile from "../../../Profile/Profile";
import './_tab-content.scss';

const TabContent = ({ activeTab, onTabChange, onLogout }) => {

    const [profileInitialView, setProfileInitialView] = useState('menu');
    const [catalogInitialFilter, setCatalogInitialFilter] = useState('all');

    const handleTabChange = (tab, params) => {
        if (tab === 'profile' && params?.initialView) {
            setProfileInitialView(params.initialView);
        }
        if (tab === 'catalog' && params?.filter) {
            setCatalogInitialFilter(params.filter);
        }
        onTabChange(tab);
    }
    return (
        <div className='tab-content'>
            {activeTab === 'home' && <Home onTabChange={handleTabChange} />}
            {activeTab === 'catalog' && <Catalog initialFilter={catalogInitialFilter}/>}
            {activeTab === 'cart' && <Cart onTabChange={handleTabChange} />}
            {activeTab === 'profile' && (
                <Profile
                    onLogout={onLogout}
                    onTabChange={handleTabChange}
                    initialView={profileInitialView}
                />
            )}
        </div>
    );
};

export default TabContent;
