import './App.css';
import MyNavbar from './components/Navbar';
import MyWelcomePage from './components/Welcome';
import LearnPage from './components/Learn';
import GamePage from './components/Game';
import ProfilePage from './components/Profile';
import { BrowserRouter as  Router, Routes, Route } from "react-router-dom"
import Login from './components/Login'
import SignUp from './components/SignUp'
import UserInfo from './components/UserInfo'
import Admin from './components/Admin'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useLocation } from 'react-router-dom';

function App() {
  const { pathname } = useLocation();
  return (
    <>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
          { (pathname !== '/sign-in' && pathname !== '/sign-up' && pathname != '/') && <MyNavbar /> }
            <Routes>
              <Route path="/welcome" element={<MyWelcomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/myprofile" element={<ProfilePage />} />
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/userInfo" element={<UserInfo />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
    
  );
}

export default App;
