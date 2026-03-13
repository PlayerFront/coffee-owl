import { ReactComponent as CatalogSvg } from '../../assets/icons/TabBar/CatalogIcon.svg';

const CatalogIcon = ({ color = '#ECD1BC', active = false }) => (
    <CatalogSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default CatalogIcon;