import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signin from './components/LogReg';

function App() {
  const [title] = useState("ResellU");
  const location = useLocation(); // Get the current location

  // State to control Navbar visibility
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // Hide the Navbar when on the login page
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
        <Route path="/login" element={<Signin />} />
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

// Wrap App in Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;