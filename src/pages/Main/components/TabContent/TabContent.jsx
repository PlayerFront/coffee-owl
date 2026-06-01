import React from "react";
import { useState } from "react";
import Home from "../../../Home/Home";
import Catalog from "../../../Catalog/Catalog";
import Cart from "../../../Cart/Cart";
import Profile from "../../../Profile/Profile";
import './_tab-content.scss';

const TabContent = ({ activeTab, onTabChange, onLogout }) => {
    const [profileInitialView, setProfileInitialView] = useState('menu');

    return (
        <div className='tab-content'>
            {activeTab === 'home' && <Home />}
            {activeTab === 'catalog' && <Catalog />}
            {activeTab === 'cart' && (
                <Cart
                    onTabChange={(tab, params) => {
                        if (tab === 'profile' && params?.initialView) {
                            setProfileInitialView(params.initialView);
                        }
                        onTabChange(tab);
                    }}
                />
            )}
            {activeTab === 'profile' && (
                <Profile
                    onLogout={onLogout}
                    onTabChange={onTabChange}
                    initialView={profileInitialView}
                />
            )}
        </div>
    );
};

export default TabContent;
