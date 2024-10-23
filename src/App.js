import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signin from './components/LogReg';
import Profile from './components/Profile';
import Home from './components/Home';
import Sell from './components/Sell';
import Product from './components/Product';
import { AuthProvider } from './authContext';

function App() {
  const [title] = useState("ResellU");
  const location = useLocation();

  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    if (location.pathname === '/login') {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [location]);

  return (
    <>
      {showNavbar && <Navbar title={title} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/product/:id" element={<Product />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;