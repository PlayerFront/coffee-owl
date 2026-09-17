import React, { useState } from "react";
import './_support.scss';
import Button from "../../../../components/Button/Button";
import TechSupportIcon from "../../../../components/TechSupportIcon/TechSupportIcon";
import SupportFAQ from "./SupportFAQ/SupportFAQ";
import IssueReport from "../../../../components/IssueReport/IssueReport";
import CoffeeBeanIcon from "../../../../components/CoffeeBeanIcon/CoffeeBeanIcon";

const Support = ({ onBack }) => {
    const [activeView, setActiveView] = useState('menu'); // menu, faq
    const [showReport, setShowReport] = useState(false);

    if (activeView === 'faq') {
        return <SupportFAQ onBack={() => setActiveView('menu')} />;
    }

    return (
        <section className="support">
            <header className="support__header">
                <TechSupportIcon />
                <h2>Техподдержка</h2>
            </header>
            <div className="support__menu">
                <button
                    className="support__menu-item"
                    onClick={() => setActiveView('faq')}
                >
                    <span className="support__menu-label">Частые вопросы</span>
                    <span className="support__menu-arrow">
                        <CoffeeBeanIcon />
                    </span>
                </button>
                <button
                    className="support__menu-item"
                    onClick={() => setShowReport(true)}
                >
                    <span className="support__menu-label">Сообщить о проблеме</span>
                    <span className="support__menu-arrow">
                        <CoffeeBeanIcon />
                    </span>
                </button>
            </div>
            <div className='support__footer'>
                <Button
                    size='large'
                    variant='secondary'
                    onClick={onBack}
                >
                    Назад</Button>
            </div>

            {showReport && (
                <IssueReport onClose={() => setShowReport(false)} />
            )}
        </section>
    )
}

export default Support;