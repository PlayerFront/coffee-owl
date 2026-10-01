import { ReactComponent as SearchSvg } from '../../assets/icons/HomePage/SearchIcon.svg';

const SearchIcon = ({ color = '#3D220D' }) => (
    <SearchSvg
        style={{ fill: color }}
        width='30'
        height='30'
    />
);

export default SearchIcon;