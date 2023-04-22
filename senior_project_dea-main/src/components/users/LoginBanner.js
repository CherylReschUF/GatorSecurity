import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function LoginBanner() {

const navbarTitle = {
  color: "white",
  fontFamily: "Inter",
  fontSize: "25px"
}

const navbarStyle = {
  backgroundColor: '#2613fe',
  height: "80px"
};

  return (
    <Navbar style={navbarStyle} expand="lg">
      <Container>
        <Navbar.Brand style={navbarTitle}>Gator Security Fundamentals</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default LoginBanner;