import {NavLink} from 'react-router-dom';

const links = [
    {to: '/', label: 'Dashboard', icon: 'bi-speedometer2', end: true},
    {to: '/add', label: 'Add Transaction', icon: 'bi-plus-circle'},
    {to: '/summary', label: 'Summary', icon: 'bi-pie-chart'},
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink key={link.to} to={link.to} end={link.end} className={({isActive}) => `sidebar-link${isActive ? ' sidebar-link-current' : ''}`}>
                        <i className={`bi ${link.icon}`}/>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}