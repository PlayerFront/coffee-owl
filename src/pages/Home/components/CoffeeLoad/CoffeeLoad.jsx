import React from "react";
import './_coffee-load.scss';

const loadData = [
    { hour: 9, value: 2 },
    { hour: 10, value: 3 },
    { hour: 11, value: 4 },
    { hour: 12, value: 3 },
    { hour: 13, value: 5 },
    { hour: 14, value: 4 },
    { hour: 15, value: 2 },
    { hour: 16, value: 3 },
    { hour: 17, value: 4 },
    { hour: 18, value: 5 },
    { hour: 19, value: 4 },
    { hour: 20, value: 3 },
    { hour: 21, value: 2 },
];

const getStatusText = (value) => {
    if (value <= 2) return 'свободно';
    if (value === 3) return ' умеренная загруженность';
    return 'высокая загруженность';
};

const CoffeeLoad = () => {
    const currentHour = new Date().getHours();
    const currentSlot = loadData.find(item => item.hour === currentHour);

    const statusText = currentSlot
        ? getStatusText(currentSlot.value)
        : 'Кофейня закрыта';

    return (
        <section className="coffee-load">
            <header className="coffee-load__header">
                <h2 className="coffee-load__title">Загруженность кофейни</h2>
            </header>

            <div className="coffee-load__chart">
                {loadData.map((item) => (
                    <div key={item.hour} className="coffee-load__column">
                        <div
                            className={`coffee-load__bar ${item.hour === currentHour ? 'coffee-load__bar--active' : ''}`}
                            style={{ height: `${item.value * 20}px` }}
                        >
                        </div>
                        <span className="coffee-load__hours">{item.hour}</span>
                    </div>
                ))}
            </div>

            <p className="coffee-load__status">Сейчас: {statusText}</p>
        </section>
    )
}

export default CoffeeLoad;