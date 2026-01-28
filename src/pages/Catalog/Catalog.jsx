import React from "react";
import Button from "../../components/Button/Button";

const Catalog = ({ user, onLogout}) => {
    return (
        <section className='catalog'>
            <h1>Тут будет каталог вкусняшек</h1>
            <Button
                onClick={onLogout}
                variant='primary'
                size='large'
            >
                Выйти
            </Button>
        </section>
    )
}

export default Catalog;