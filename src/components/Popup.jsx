import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Popup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('register');
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    toast.success('Registered successfully');
    setActiveTab('login');
  };

  const handleLoginSuccess = () => {
    toast.success('Login successful');
    onClose();
    navigate('/ai');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-3xl w-3/4 max-w-4xl relative flex shadow-2xl shadow-black/50">
        {/* Left Section (Form and Tabs) - Equal width */}
        <div className="flex-1 bg-[#131313] rounded-l-3xl p-6 relative">
          {/* Toggle Buttons */}
          <div className="flex justify-start mb-4 gap-2">
            <button
              className={`px-4 py-2 text-white ${
                activeTab === 'register' ? 'border-b-2 border-white' : ''
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
            <button
              className={`px-4 py-2 text-white ${
                activeTab === 'login' ? 'border-b-2 border-white' : ''
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
          </div>

          {/* Form Container */}
          <div className="h-96 overflow-auto">
            {activeTab === 'register' ? (
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        </div>

        {/* Right Section (Solid Color) - Equal width with enhanced text styling */}
        <div className="flex-1 bg-[#d18b3c] rounded-r-3xl relative flex flex-col items-center justify-center">
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[#131313] text-xl font-bold hover:bg-[#131313] hover:text-[#d18b3c] rounded-full transition-colors duration-300"
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
          <h1 className="text-5xl font-extrabold text-[#131313] mb-4 tracking-wider text-shadow-xl bg-clip-text  bg-gradient-to-r from-[#131313] to-[#4a2f0b] hover:scale-110 transition-transform duration-500 font-rajdhani">
            UNIFIED AI
          </h1>
          <p className="text-xl text-[#131313] font-semibold text-center px-6 italic text-shadow-sm hover:scale-105 transition-transform duration-300">
            Empowering Intelligence, Unifying Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <div className="my-3">
        <label className="block text-[#cdced0] font-medium">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-[#cdced0] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="my-3">
        <label className="block text-[#cdced0] font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-[#cdced0] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="my-3">
        <label className="block text-[#cdced0] font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-[#cdced0] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-2 bg-[#d18b3c] text-white rounded hover:bg-[#b37432] transition-colors duration-200"
        >
          Register
        </button>
      </div>
    </form>
  );
};

const LoginForm = ({ onLoginSuccess }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

//   const login = async (emailOrUsername, password) => {
//     try {
//       await axios.post('https://unifiedai.onrender.com/api/v1/user/login', {
//         emailOrUsername,
//         password,
//       });
//       toast.success('Login successful');
//       onLoginSuccess();
//     } catch (error) {
//       toast.error('Login failed');
//       console.error('Login error:', error);
//     }
//   };

const login = async (emailOrUsername, password) => {
    try {
      const response = await axios.post('https://unifiedai.onrender.com/api/v1/user/login', {
        emailOrUsername,
        password,
      });
  
      const accessToken = response.data.data.accessToken;
  
      // Set the access token in cookies
      document.cookie = `unifiedAiAccessToken=${accessToken}; path=/; secure; samesite=strict`; // Important: secure and samesite in production
  
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
      <div className="my-3">
        <label className="block text-[#cdced0] font-medium">Email or Username</label>
        <input
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-[#cdced0] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="my-3">
        <label className="block text-[#cdced0] font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-[#cdced0] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-2 bg-[#d18b3c] text-white rounded hover:bg-[#b37432] transition-colors duration-200"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Popup;
