import { ReactComponent as AgreementSvg} from '../../assets/icons/ProfilePage/AgreementIcon.svg';

const AgreementIcon = ({ color = '#3D220D' }) => (
    <AgreementSvg
        style={{ fill: color }}
        width='20'
        height='20'
    />
);

export default AgreementIcon;