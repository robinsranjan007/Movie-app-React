import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const newUser = {
      ...formData,
      playlist: [],
      likedMovies: [],
      watchLater: [],
      ratings: [],
      reviews: [],
    };

    try {
      const response = await axios.post('http://localhost:5000/users', newUser);
      console.log("User Registered:", response.data);

      localStorage.setItem('username', response.data.username);
      localStorage.setItem('userId', response.data.id);

      alert("Signup successful!");
      navigate('/');
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Failed to register user.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vdmllcyUyMGJsYWNrfGVufDB8fDB8fHww')" }}>
      <div className="bg-black bg-opacity-90 text-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">
            Flix<span className="text-red-600">Net</span>
          </h1>
          <p className="text-gray-400 mt-2">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-400">First Name</label>
            <input type="text" name="firstName" placeholder="Enter your first name"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.firstName} onChange={handleChange} required />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-400">Last Name</label>
            <input type="text" name="lastName" placeholder="Enter your last name"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.lastName} onChange={handleChange} required />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-400">Age</label>
            <input type="number" name="age" placeholder="Enter your age"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.age} onChange={handleChange} required />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-400">Username</label>
            <input type="text" name="username" placeholder="Enter your username"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.username} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400">Email</label>
            <input type="email" name="email" placeholder="Enter your email"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.email} onChange={handleChange} required />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400">Password</label>
            <input type="password" name="password" placeholder="Enter your password"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.password} onChange={handleChange} required />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-400">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password"
                   className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                   value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          {/* Sign Up Button */}
          <button type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-gray-400">
          <p>
            Already have an account? <Link to="/login" className="text-red-500 hover:text-red-600">Log in now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
