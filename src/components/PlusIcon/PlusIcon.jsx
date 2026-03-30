import { ReactComponent as PlusSvg } from '../../assets/icons/CatalogPage/PlusIcon.svg';

const PlusIcon = ({ color = '#ECD1BC'}) => (
    <PlusSvg
        style={{ fill: color}}
        width='16' // в макете 18
        height='16' // в макете 18
    />
);

export default PlusIcon;