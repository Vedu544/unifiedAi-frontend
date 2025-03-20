import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported

const AI = () => {
  // State to control sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [getAImodels, setModels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added for error handling
  const [selectedAPIs, setSelectedAPIs] = useState([]); // Track selected APIs

  // Fetch AI models when the component mounts
  useEffect(() => {
    fetchAImodels();
  }, []);

  const fetchAImodels = async () => {
    try {
      const response = await axios.get("https://unifiedai.onrender.com/api/v1/aiModel/get-models");
      setModels(response.data.data); // Assuming the array is in response.data.data
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch AI models");
      setLoading(false);
    }
  };

  // Handle checkbox toggle for API selection
  const handleCheckboxChange = (modelId) => {
    setSelectedAPIs((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  // Mock data for past chats (replace with dynamic data in a real app)
  const pastChats = [
    { id: 1, title: "Chat about React" },
    { id: 2, title: "Tailwind CSS tips" },
    { id: 3, title: "Building a sidebar" },
  ];

  return (
    <>
      {/* Fixed "View Past History" Button */}
      <button
        className="fixed top-4 left-4 bg-white text-black px-4 py-2 rounded hover:scale-105 transition-transform z-50 text-xl cursor-pointer"
        onClick={() => setIsSidebarOpen(true)}
      >
        View Past History
      </button>

      {/* Fixed "Logout" Button */}
      <button
        className="fixed top-4 right-4 bg-white text-black px-4 py-2 rounded hover:scale-105 transition-transform z-50 text-xl cursor-pointer"
        onClick={() => {
          console.log("Logout clicked");
          // Add logout logic here (e.g., clear session, redirect)
        }}
      >
        Logout
      </button>

      {/* Main Content */}
      <div className="bg-black min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-800 to-red-600 bg-clip-text text-transparent">
          Good Evening, Vedant
        </h1>
        <p className="text-white text-lg sm:text-xl md:text-2xl mt-4">
          How can I help you today?
        </p>
        <div className="mt-6 w-11/12 sm:w-3/4 max-w-lg">
          <div className="flex items-center border border-gray-300 bg-black text-white rounded-full p-2">
            <input
              type="text"
              placeholder="Ask Unified AI anything..."
              className="p-3 flex-grow bg-black outline-none text-white placeholder-gray-400"
            />
            <button className="p-2 bg-gray-600 rounded-full text-white">
              ➝
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Unified AI</h2>
          <button
            className="text-black hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button className="w-full bg-gray-100 text-black px-4 py-2 rounded hover:bg-gray-200 hover:scale-102 transition-all">
            New Chat
          </button>
        </div>

        {/* Past Chats List */}
        <ul className="p-4 space-y-2">
          {pastChats.map((chat) => (
            <li
              key={chat.id}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 hover:scale-102 transition-all cursor-pointer"
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Select API Box */}
      <div className="fixed bottom-4 right-4 bg-white text-black p-4 rounded-b-sm mb-2 shadow-lg z-50 max-h-96 overflow-y-auto">
        <h3 className="text-xl font-bold mb-2">Select API</h3>
        {loading ? (
          <p>Loading APIs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4  pt-4">
            {getAImodels.map((model) => (
              <div key={model.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={model.id}
                  checked={selectedAPIs.includes(model.id)}
                  onChange={() => handleCheckboxChange(model.id)}
                  className="mr-2"
                />
                <img
                  src={model.logo_secure_url}
                  alt={model.name}
                  className="w-6 h-6 mr-2 rounded-full"
                />
                <label htmlFor={model.id} className="cursor-pointer">
                  {model.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AI;