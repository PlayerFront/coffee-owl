import './_start.scss';
import logoImage from '../../assets/icons/StartPage/startPageIcon.webp';
import titleImage from '../../assets/icons/StartPage/startPageTitleIcon.webp';
import Button from '../../components/Button/Button';

const Start = ({ onNavigate }) => {
    
    const handleClickLogin = () => {
        console.log('Кнопка войти нажата');
        onNavigate('login');
    };

    const handleClickRegister = () => {
        console.log('Кнопка регистрации нажата');
        onNavigate('register');
    }
    return (
        <section className='start' id='start'>
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
        </section>
    )
}

export default Start;