import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:8080/authenticate', {
  //       "username":username,
  //       "password":password,
  //     });

  //     // Store the JWT token in localStorage
  //     localStorage.setItem('token', response.data.token);
  //     console.log(token+"token")

  //     // Clear form and error, navigate to home or dashboard (customize as needed)
  //     setUsername('');
  //     setPassword('');
  //     setError('');
  //     // Redirect user or update app state to indicate they are logged in

  //   } catch (error) {
  //     setError('Invalid username or password');
  //  http://10.1.12.69:8085/api/authenticate }
  //http://localhost:8080/api/authenticate };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/authenticate', {
            username: username,
            password: password
        });

        console.log("Login response:", response); // Log the entire response object
        console.log("Token:", response.data); // Log only the token if it's in response.data

        // Store the JWT token in localStorage
        localStorage.removeItem('token');
        localStorage.setItem('token', response.data);
        navigate('/assemblynah/search');

        // Clear form and error, navigate to home or dashboard (customize as needed)
        setUsername('');
        setPassword('');
        setError('');
        console.log(localStorage.getItem('token'))
    } catch (error) {
        console.error("Login error:", error); // Log error if login fails
        setError('Invalid username or password');
    }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white hover:text-black bg-custom-yellow rounded hover:bg-amber-500"
           
          >
            Login
          </button>
        </form>
      
      </div>
    </div>
  );
};

export default Login;
