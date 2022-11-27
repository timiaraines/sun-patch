import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/logo.png';

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
   
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              <Nav.Link href="#garden-tracker" className={activeLink === 'garden-tracker' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('garden-tracker')}>Garden Tracker</Nav.Link>
              <Nav.Link href="#plant-info" className={activeLink === 'plant-info' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('plant-info')}>Plant Info</Nav.Link>
            </Nav>
            <span className="navbar-text">
              
                <button className="search"><span>Search</span></button>
              
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    
  )
}