import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '../ui/toastService';
import { showSuccessToast } from '../ui/toastService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../features/dashboardSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(API_URL);
      const users = response.data;

      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        showSuccessToast('Login successful');
        localStorage.setItem('userId', user.id);
        setTimeout(() => {
          navigate('/employee');
        }, 1000);
      } else if (email === 'admin@gmail.com' && password === 'admin123') {
        showSuccessToast('Login successful');
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        showErrorToast('Invalid email or password');
      }
    } catch (error) {
      showErrorToast('Error fetching user data');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-600 to-indigo-800">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">admin@gmail.com/admin123</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;