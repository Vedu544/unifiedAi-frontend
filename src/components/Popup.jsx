import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Popup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('register');
  const navigate = useNavigate();

  // Callback for successful registration
  const handleRegisterSuccess = () => {
    toast.success('Registered successfully');
    setActiveTab('login');
  };

  // Callback for successful login
  const handleLoginSuccess = () => {
    toast.success('Login successful');
    onClose();
    navigate('/ai'); // Navigate to AI page (adjust the route as needed)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-3xl w-3/4 max-w-4xl relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-black text-xl font-bold"
          onClick={onClose}
        >
          X
        </button>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 gap-2">
          <button
            className={`px-6 py-2 rounded-t-lg ${
              activeTab === 'register'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg ${
              activeTab === 'login'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>

        {/* Form and Image Layout */}
        <div
          className={`flex ${
            activeTab === 'register' ? 'flex-row' : 'flex-row-reverse'
          } h-96`}
        >
          {/* Form Container */}
          <div className="flex-1 p-4 overflow-auto">
            {activeTab === 'register' ? (
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
          </div>

          {/* Vertical Line */}
          <div className="w-px bg-gray-300"></div>

          {/* Image Container */}
          <div className="flex-1 p-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s"
              alt="Popup Image"
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Form Component
const RegisterForm = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration function
  const register = async (username, email, password) => {
    try {
      await axios.post('https://unifiedai.onrender.com/api/v1/user/Register', {
        username,
        email,
        password,
      });
      toast.success('Registered successfully');
      onRegisterSuccess();
    } catch (error) {
      toast.error('Registration failed');
      console.error('Registration error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(username, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-black font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-black font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-black font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600"
      >
        Register
      </button>
    </form>
  );
};

// Login Form Component
const LoginForm = ({ onLoginSuccess }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  // Login function
  const login = async (emailOrUsername, password) => {
    try {
      await axios.post('https://unifiedai.onrender.com/api/v1/user/login', {
        emailOrUsername,
        password,
      });
      toast.success('Login successful');
      onLoginSuccess();
    } catch (error) {
      toast.error('Login failed');
      console.error('Login error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(emailOrUsername, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-black font-medium">Email or Username</label>
        <input
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-black font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600"
      >
        Login
      </button>
    </form>
  );
};

export default Popup;