import React, { useState } from "react";
import './_cafe-info.scss';
import LocationIcon from "../../../../components/LocationIcon/LocationIcon";
import ClockIcon from "../../../../components/ClockIcon/ClockIcon";
import MapModal from "./MapModal";

const CafeInfo = () => {
    const [showMap, setShowMap] = useState(false);

    return (
        <section className="cafe-info">
            <button
                className="cafe-info__address"
                onClick={() => setShowMap(true)}
            >
                <LocationIcon />
                <span>ул. Пушкина, д. 10</span>
            </button>

            <div className="cafe-info__hours">
                <ClockIcon />
                <span>9:00-22:00</span>
            </div>

            {showMap && <MapModal onClose={() => setShowMap(false)} />}
        </section>
    );
};

export default CafeInfo;