import React from "react";
import './_login.scss';
import Button from "../../components/Button/Button";

const Login = ({ onNavigate }) => {

    const handleClickBack = () => {
        onNavigate('start');
    }
    return (
        <section className='login' id='login'>
            <Button
                variant='secondary'
                size='small'
                onClick={handleClickBack}
            >
                ←
            </Button>
            <p>Страница входа в приложение</p>
        </section>
    );
};

export default Login;