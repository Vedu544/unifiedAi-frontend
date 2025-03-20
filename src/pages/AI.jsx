import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AI = () => {
  // State declarations
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar visibility
  const [getAImodels, setModels] = useState(null); // AI models data
  const [loading, setLoading] = useState(true); // Loading state for models
  const [error, setError] = useState(null); // Error handling
  const [selectedAPIs, setSelectedAPIs] = useState([]); // Selected API model IDs
  const [promptText, setPromptText] = useState(""); // Prompt input text
  const [messages, setMessages] = useState([]); // Chat messages (user and AI responses)
  const chatContainerRef = useRef(null); // Ref for chat container to scroll

  // Fetch AI models on mount
  useEffect(() => {
    fetchAImodels();
  }, []);

  const fetchAImodels = async () => {
    try {
      const response = await axios.get(
        "https://unifiedai.onrender.com/api/v1/aiModel/get-models"
      );
      setModels(response.data.data); // Store models array
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch AI models");
      setLoading(false);
    }
  };

  // Handle sending the prompt and fetching responses
  const handleSendPrompt = async () => {
    axios.defaults.withCredentials = true; // Enable sending cookies with requests
    if (promptText.trim() === "") return; // Prevent empty prompts
    if (selectedAPIs.length === 0) {
      alert("Please select at least one API"); // Notify if no APIs selected
      return;
    }

    // Add user's prompt to messages (right side)
    setMessages((prev) => [...prev, { role: "user", content: promptText }]);
    const currentPrompt = promptText;
    setPromptText(""); // Clear input

    // Send prompt and selected models to API
    try {
      const token = Cookies.get("unifiedAiAccessToken"); // Get the token from cookies
      const response = await axios.post(
        "https://unifiedai.onrender.com/api/v1/chat/get-reply-from-ai",
        {
          promptText: currentPrompt,
          selectedTextModels: selectedAPIs, // Send selected model IDs
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the authorization header
          },
        }
      );

      // Assuming response.data.data is an array of { modelId, response }
      const aiResponses = response.data.data.promptResponses;

      // Add each AI response to messages (left side)
      // aiResponses.forEach((res) => {
      //   const modelName = getAImodels.find((model) => model.id === res.modelId)?.name || "Unknown Model";
      //   setMessages((prev) => [...prev, { role: "ai", content: `${modelName}: ${res.response}` }]);
      // });
      aiResponses.forEach((res) => {
        const modelName =
          getAImodels.find((model) => model.id === res.modelId)?.name ||
          "Unknown Model";
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `${modelName}: ${res.responseText}` },
        ]);
      });
    } catch (error) {
      console.log(error);
      setError("Failed to fetch response");
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Failed to get response from AI" },
      ]);
    }
  };

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle API selection checkbox changes
  // const handleCheckboxChange = (modelId) => {
  //   setSelectedAPIs((prev) =>
  //     prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
  //   );
  // };

  // const handleCheckboxChange = (model) => {
  //   setSelectedAPIs((prev) => {
  //     // const model = getAImodels.find(m => m.id === modelId);
  //     const modelObj = { id: model.ai_model_id, name: model.name };
  //     console.log(modelObj);
  //     // Check if model is already selected by id
  //     const exists = prev.some(api => api.id === model.ai_model_id);

  //     if (exists) {
  //       // Remove the model if it exists
  //       return prev.filter((api) => api.id !== model.ai_model_id);
  //     } else {
  //       // Add the new model object
  //       return[...prev, modelObj];
  //     }
  //   });
  // }

  const handleCheckboxChange = (model) => {
    setSelectedAPIs((prev) => {
      const modelObj = { id: model.ai_model_id, name: model.name };
      const exists = prev.some((api) => api.id === modelObj.id);

      if (exists) {
        return prev.filter((api) => api.id !== modelObj.id);
      } else {
        return [...prev, modelObj];
      }
    });
  };

  // Mock past chats data
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
        onClick={() => console.log("Logout clicked")}
      >
        Logout
      </button>

      {/* Main Content */}
      <div className="flex flex-col h-screen bg-black">
        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
          {messages.length === 0 ? (
            // Initial Screen
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-800 to-red-600 bg-clip-text text-transparent">
                Good Afternoon,
              </h1>
              <p className="text-white text-lg sm:text-xl md:text-2xl mt-4">
                How can I help you today?
              </p>
            </div>
          ) : (
            // Chat Messages
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
                style={{ maxWidth: "80%" }}
              >
                <p>{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Search Bar (Bottom Center) */}
        <div className="p-4">
          <div className="flex items-center border border-gray-300 bg-black text-white rounded-full p-2 w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Ask Unified AI anything..."
              className="p-3 flex-grow bg-black outline-none text-white placeholder-gray-400"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
            <button
              className={`p-2 bg-gray-600 rounded-full text-white ${
                selectedAPIs.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSendPrompt}
              disabled={selectedAPIs.length === 0}
            >
              ➝
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#131313] text-black transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Unified AI</h2>
          <button
            className="text-black hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <button className="w-full bg-[#1E1F21] text-[#cdced0] px-4 py-2 rounded hover:bg-gray-200 hover:font-bold hover:scale-102 transition-all">
            New Chat
          </button>
        </div>
        <ul className="p-4 space-y-2">
          {pastChats.map((chat) => (
            <li
              key={chat.id}
              className="px-4 py-2 bg-[#1E1F21] text-[#cdced0] rounded hover:bg-gray-300 hover:text-black hover:scale-102 transition-all cursor-pointer"
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Select API Box */}
      <div className="fixed bottom-4 right-4 bg-[#1E1F21] text-[#cdced0] p-4 rounded-b-sm mb-2 shadow-lg z-50 max-h-96 overflow-y-auto">
        <h3 className="text-xl font-bold mb-2">Select Models</h3>
        {loading ? (
          <p>Loading models...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          // <div className="space-y-4 pt-4">
          //   {getAImodels.map((model) => (

          //     <div key={model.id} className="flex items-center">
          //       <input
          //         type="checkbox"
          //         id={model.id}
          //         checked={selectedAPIs.includes({id:model.id, name:model.name})}
          //         onChange={() => handleCheckboxChange(model)}
          //         className="mr-2"
          //       />
          //       <img
          //         src={model.logo_secure_url}
          //         alt={model.name}
          //         className="w-6 h-6 mr-2 rounded-full"
          //       />
          //       <label htmlFor={model.id} className="cursor-pointer">
          //         {model.name}
          //       </label>
          //     </div>
          //   ))}
          // </div>
          <div className="space-y-4 pt-4">
            {getAImodels.map((model) => (
              <div key={model.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={model.id}
                  checked={selectedAPIs.some(
                    (api) => api.id === model.ai_model_id
                  )} // Updated check
                  onChange={() => handleCheckboxChange(model)}
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
