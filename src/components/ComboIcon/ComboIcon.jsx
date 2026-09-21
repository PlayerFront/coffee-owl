import { ReactComponent as ComboSvg } from '../../assets/icons/HomePage/ComboIcon.svg';

const ComboIcon = ({ color = '#ECD1BC' }) => (
    <ComboSvg
        style={{ fill: color }}
        width='24'
        height='24'
    />
);

export default ComboIcon;