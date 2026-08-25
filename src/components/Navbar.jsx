import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from 'react-router-dom';
import {useTheme} from '../context/ThemeContext';

const linkClass = ({isActive}) => `nav-link${isActive ? ' nav-link-current' : ''}`;

export default function AppNavbar() {
    const {theme, toggleTheme} = useTheme();

    return (
        <Navbar expand="lg" data-bs-theme="dark" className="shadow-sm navbar-pink" sticky="top">
            <Container fluid className="px-5 py-3">
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
                    <i className="bi bi-currency-exchange"></i>
                    Personal Budget Tracker
                </Navbar.Brand>

                <div className="d-flex align-items-center gap-3 order-lg-2">
                    <button onClick={toggleTheme} className="theme-toggle">
                        <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}></i>
                    </button>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                </div>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="d-lg-none flex-column mobile-nav-links">
                        <Nav.Link as={NavLink} to="/" end className={linkClass}>
                            <i className="bi bi-speedometer2 me-2"></i>Dashboard
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/add" className={linkClass}>
                            <i className="bi bi-plus-circle me-2"></i>Add Transaction
                        </Nav.Link>
                        <Nav.Link as={NavLink} to ="/summary" className={linkClass}>
                            <i className="bi bi-pie-chart me-2"></i>Summary
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}