import React from "react";
import Home from "../../../Home/Home";
import Catalog from "../../../Catalog/Catalog";
import Cart from "../../../Cart/Cart";
import Profile from "../../../Profile/Profile";
import './_tab-content.scss';

const TabContent = ({ activeTab, onLogout }) => {
    return (
        <div className='tab-content'>
            {activeTab === 'home' && <Home />}
            {activeTab === 'catalog' && <Catalog />}
            {activeTab === 'cart' && <Cart />}
            {activeTab === 'profile' && <Profile onLogout={onLogout} />}
        </div>
    );
};

export default TabContent;