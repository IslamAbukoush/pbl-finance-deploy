import { useContext, useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Portfolio from './components/Portfolio/Portfolio';
import Profile from './components/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard';
import Features from './components/Features/Features';
import Pricing from './components/Pricing/Pricing';
import FAQ from './components/FAQ/FAQ';
import LeftBar from './components/LeftBar/LeftBar';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Register/Register';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Context, { authContext } from './hooks/Context';
import ProtectedRoute from './provider/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Content from './components/Content/Content';
import Buy from './components/Buy/Buy'
import Bubbles from './components/Bubbles/Bubbles'
import Chart from './components/Chart/Chart'
import Assets from './components/Assets/Assets';
import Contact from './components/ContactUs/Contact';
import { StarsCanvas } from './components/canvas';
import Preferences from './components/Preferences/Preferences';
import Settings from './components/Settings/Settings';
import Notifications from './components/Notifications/Notifications';

function Layout() {
  const location = useLocation();
  const showHeader = !['/', '/login', '/register', '/error', '/forgot', '/preferences'].includes(location.pathname);
  const showSidebar = !['/', '/login', '/register', '/error', '/forgot', '/contact-us', '/pricing', '/preferences'].includes(location.pathname);
  const {lightMode, setLightMode, changeMode, preferredMode} = useContext(authContext);
  useEffect(() => {
    console.log("Preferred mode before change:", preferredMode);
    // Use changeMode to update the mode
    changeMode(preferredMode);
  
    console.log("Preferred mode after change:", preferredMode);
  
    if (preferredMode === 'system') {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
      const handleChange = (event) => {
        const isLightMode = event.matches;
        console.log("System color scheme changed:", isLightMode ? "light" : "dark");
        setLightMode(isLightMode);
      };
      mediaQuery.addEventListener("change", handleChange);
      setLightMode(mediaQuery.matches);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setLightMode(preferredMode === 'light');
    }
  }, [preferredMode]);

  const toggleLightMode = _=> setLightMode((lightMode)=>{return !lightMode});
  return (
    <div className={`app-container${lightMode? " bg-light-primary":""}`}>
      {showHeader && <Header />}
      <div className="content-container">
        {showSidebar && <LeftBar />}
        <Content shouldWrap={showHeader && showSidebar}>
          <Routes>
            <Route path='/preferences' element={<Preferences/>}/>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/bubbles" element={<ProtectedRoute><Bubbles /></ProtectedRoute>} />
            <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
            <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact-us" element={<div className="relative z-0 w-full p-10 "><Contact /> <StarsCanvas/></div>} />
            {/* <Route path="/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chart" element={<Chart symbol='ETCUSDT' />} />
          </Routes>
        </Content>
      </div>
      {/* <div className={'thing' + (lightMode?" thing_black":"")} onClick={toggleLightMode}></div> */}
    </div>

  );
}

function App() {
  return (
    <Router>
      <Context>
        <Layout />
      </Context>
    </Router>
  );
}


export default App;
