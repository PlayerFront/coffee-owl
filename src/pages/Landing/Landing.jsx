import React, { useState, useEffect } from "react";
import './_landing.scss';
import Button from "../../components/Button/Button";
import logoImage from '../../assets/icons/StartPage/startPageIcon.webp';
import titleImage from '../../assets/icons/StartPage/startPageTitleIcon.webp';
import InstallGuideModal from "./components/InstallGuideModal/InstallGuideModal";

const Landing = ({ onOpen }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallGuide, setShowInstallGuide] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('Приложение установлено');
            }
            setDeferredPrompt(null);
        } else {
            setShowInstallGuide(true);
        }
    }

    return (
        <section className="landing">
            <div className="landing__content">
                <div className='landing__logo'>
                    <img src={logoImage} alt='Coffee Owl - логотип кофейни' />
                </div>
                <div className='landing__title'>
                    <img src={titleImage} alt='Coffee Owl - название кофейни' />
                </div>
            </div>
            <div className="landing__footer">
                <p className="landing__text">
                    Заказ можно сделать только через приложение кофейни
                </p>
                <Button
                    variant="primary"
                    size="large"
                    onClick={onOpen}
                >
                    Открыть в приложении
                </Button>
                <Button
                    variant="secondary"
                    size="large"
                    onClick={handleInstall}
                >
                    Установить приложение
                </Button>
            </div>
            {showInstallGuide && (
                <InstallGuideModal onClose={() => setShowInstallGuide(false)} />
            )}

        </section>
    );
};

export default Landing;