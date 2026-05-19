import { ReactComponent as ContactsSvg } from '../../assets/icons/ProfilePage/ContactsIcon.svg';

const ContactsIcon = ({ color = '#3D220D' }) => (
    <ContactsSvg
        style={{ fill: color }}
        width='16'
        height='16'
    />
);

export default ContactsIcon;