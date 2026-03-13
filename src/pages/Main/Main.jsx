import React, { useState } from "react";
import TabBar from "./components/TabBar/TabBar";
import TabContent from "./components/TabContent/TabContent";
import './_main.scss';

const Main = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className='main'>
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            <TabContent activeTab={activeTab} onLogout={onLogout} />
        </div>
    );
};

export default Main;