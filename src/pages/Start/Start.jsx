import './_start.scss';
import logoImage from '../../assets/icons/StartPage/startPageIcon.webp';
import titleImage from '../../assets/icons/StartPage/startPageTitleIcon.webp';
import Button from '../../components/Button/Button';
import IssueReport from '../../components/IssueReport/IssueReport';
import { useState } from 'react';
import HelpIcon from '../../components/HelpIcon/HelpIcon';

const Start = ({ onNavigate }) => {
    
    const [showIssueModal, setShowIssueModal] = useState(false);
    

    const handleClickLogin = () => {
        onNavigate('login');
    };

    const handleClickRegister = () => {
        onNavigate('register');
    }
    return (
        <section className='start' id='start'>
            <button
                className='start__help'
                onClick={() => setShowIssueModal(true)}
                aria-label='Сообщить о проблеме'
            >
                <HelpIcon />
            </button>
            <div className='start__background'>
                <div className='start__logo'>
                    <img src={logoImage} alt='Coffee Owl - логотип кофейни' />
                </div>
                <div className='start__title'>
                    <img src={titleImage} alt='Coffee Owl - название кофейни'/>
                </div>
            </div>
            <div className='start__buttons'>
                <Button
                    variant='primary'
                    size='large'
                    onClick={handleClickLogin}
                >
                    Войти
                </Button>
                <Button
                    variant='secondary'
                    size='large'
                    onClick={handleClickRegister}
                >
                    Зарегистрироваться
                </Button>
            </div>

            {showIssueModal && (
                <IssueReport
                    onClose={() => setShowIssueModal(false)}
                />
            )}
        </section>
    )
}

export default Start;