import { ReactComponent as MinusSvg } from '../../assets/icons/CatalogPage/MinusIcon.svg';

const MinusIcon = ({ color = '#ECD1BC'}) => (
    <MinusSvg
        style={{ fill: color}}
        width='16' // в макете 18
        height='16' // в макете 18
    />
);

export default MinusIcon;