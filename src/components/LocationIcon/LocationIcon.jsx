import { ReactComponent as LocationSvg }  from'../../assets/icons/CartPage/ChekoutModal/LocationIcon.svg';

const LocationIcon = ({ color = '#3D220D'}) => (
    <LocationSvg
        style={{ fill: color }}
        width='24'
        height='24'
    />
);

export default LocationIcon;