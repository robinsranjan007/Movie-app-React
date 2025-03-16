import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Fetch users from JSON Server
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      // Find user in database
      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        // Store user details in localStorage
        localStorage.setItem("username", user.username);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", `${user.firstName} ${user.lastName}`);
        localStorage.setItem("role", user.role); // Store role to determine admin access

        alert("Login successful!");

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin/users", { replace: true }); // Redirect admin to User List
        } else {
          navigate("/", { replace: true }); // Redirect normal users to Home
        }
        
        // Ensure UI updates properly after login
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=60')" }}>
      <div className="bg-opacity-90 bg-black text-white p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold">
            Flix<span className="text-red-600">Net</span>
          </div>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-400">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Log In
          </button>
        </form>

        <div className="text-center mt-4 text-gray-400">
          <p>Don't have an account? <Link to="/signup" className="text-red-500 hover:text-red-600">Sign up now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
