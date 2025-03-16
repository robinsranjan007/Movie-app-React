import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './layouts/navbar/header';  
import RouterComponent from './routes/Router';   

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check user role from localStorage
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  return (
    <Router>
      {/* ✅ Ensure Header Stays at the Top */}
      {!isAdmin && <Header />}

      {/* ✅ Ensure the rest of the app content is below */}
      <div className="min-h-screen">
        <RouterComponent />
      </div>
    </Router>
  );
};

export default App;
