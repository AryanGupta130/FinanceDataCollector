import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom'; // Import Link
import './NavBar.css';

const NavbarComponent: React.FC = () => {
    return (
        <Navbar bg="dark" expand="lg" className="navbar-custom" variant="dark">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    Finance Data Collector
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="navbar-nav-custom">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/stock-analysis" className="nav-link-custom">
                            Stock Analysis
                        </Nav.Link>
                        <Nav.Link as={Link} to="/options-strategies" className="nav-link-custom">
                            Options Strategies
                        </Nav.Link>
                        <Nav.Link as={Link} to="/login" className="nav-link-custom">
                            Login
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;