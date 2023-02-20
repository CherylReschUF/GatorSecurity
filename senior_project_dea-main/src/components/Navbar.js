import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from "react-router-bootstrap";
import { useEffect, useState } from 'react';

function MyNavbar() {
  const [isAdmin, setIsAdmin] = useState({isAdmin: false});

  useEffect(() => {
    async function adminStatus() {
      fetch("http://localhost:5000/users/checkPrivileges", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
          token:window.localStorage.getItem("token"),
        }),
        }).then((res)=>res.json())
        .then((data)=>{
          if(data.status === 200) {
            setIsAdmin(true);
          }
          else {
            setIsAdmin(false);
          }
        });
    }
    adminStatus();
}, []);

/* Navbar CSS? */
const navbarTitle = {
  color: "white",
  fontFamily: "Gluten",
  fontSize: "25px"
  
}

const dropdown = {
  backgroundColor: "#2613fe"
};

const dropdownItem = {
  color: "white",
  backgroundColor: "#2613fe",
  fontFamily: "Gluten"
 
};

const navLink = {
  color: "white",
  fontFamily: "Gluten",
  fontSize: "18px",  
  flexDirection: "column"
  
};

const linkContainer = {
  flexDirection: "column",
  justifyContent: "center",
  display: "flex",
  alignItems: "center"
};

const navbarStyle = {
  backgroundColor: '#2613fe',
  height: "80px"
};

  return (
    <Navbar style={navbarStyle} expand="lg" >
      <Container>
        <LinkContainer to="/welcome" style={navbarTitle}>
          <Navbar.Brand style={navbarTitle}>
            Gator Security Fundamentals
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-nav ms-auto mb-2 mb-lg-0" style={{color:'white'}}>            
            <LinkContainer to="/learn" style={navLink}>
              <Nav.Link style={navLink} eventKey={1}> 
                <div style={linkContainer}>
                  Learn
                  <img src='./bookIcon.png' alt=''/>
                </div>
              </Nav.Link>
            </LinkContainer>                 
            <LinkContainer to="/game" style={navLink}>
              <Nav.Link style={navLink} eventKey={2}>
                <div style={linkContainer}>
                  Game
                  <img src='./gameIcon.png' alt=''/>
                </div>
              </Nav.Link>
            </LinkContainer>
            <NavDropdown style={dropdown} title={<img src='./profileIcon.png' alt=''/>}>
              <LinkContainer to="/myprofile" style={dropdownItem}>
                <NavDropdown.Item style={dropdownItem} eventKey={3.1}>
                  My Profile
                </NavDropdown.Item>
              </LinkContainer>
              { isAdmin && 
              <><LinkContainer to="/admin" style={dropdownItem}>
                  <NavDropdown.Item style={dropdownItem} eventKey={3.2}>
                    Admin Panel
                  </NavDropdown.Item>
                </LinkContainer><LinkContainer to="/modify_questions" style={dropdownItem}>
                    <NavDropdown.Item style={dropdownItem} eventKey={3.3}>
                      Question Editor
                    </NavDropdown.Item>
                  </LinkContainer></>
              }
              <LinkContainer to="/log-out" style={dropdownItem}>
                <NavDropdown.Item style={dropdownItem} eventKey={3.4}>
                  Logout
                </NavDropdown.Item> 
              </LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;