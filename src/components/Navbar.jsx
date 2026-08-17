import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {NavLink} from 'react-router-dom';

export default function AppNavbar() {
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={NavLink} to="/">
                    Personal Budget Tracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me=auto">
                        <Nav.Link as={NavLink} to="/" end>Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/add">Add Transaction</Nav.Link>
                        <Nav.Link as={NavLink} to="/summary">Summary</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}