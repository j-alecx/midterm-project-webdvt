import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from 'react-router-dom';
import {useTheme} from '../context/ThemeContext';

const linkClass = ({isActive}) => `nav-link${isActive} ? 'nav-link-current' : ''}`;

export default function AppNavbar() {
    const {theme, toggleTheme} = useTheme();

    return (
        <Navbar expand="lg" data-bs-theme="dark" className="shadow-sm navbar-pink" sticky="top">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
                    <i class="bi bi-currency-exchange"></i>
                    Personal Budget Tracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-2">
                        <Nav.Link as={NavLink} to="/" end className={linkClass}>Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/add" className={linkClass}>Add Transaction</Nav.Link>
                        <Nav.Link as={NavLink} to="/summary" className={linkClass}>Summary</Nav.Link>
                        <button onClick={toggleTheme} className="theme-toggle">
                            <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
                        </button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}