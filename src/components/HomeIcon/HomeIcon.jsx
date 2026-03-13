import { ReactComponent as HomeSvg } from '../../assets/icons/TabBar/HomeIcon.svg';

const HomeIcon = ({ color = '#ECD1BC', active = false}) => (
    <HomeSvg 
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default HomeIcon;