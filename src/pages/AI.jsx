import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns"; // For formatting dates in the sidebar

const AI = () => {
  // State declarations
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [getAImodels, setModels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAPIs, setSelectedAPIs] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [messages, setMessages] = useState([]);
  const [pastHistory, setPastHistory] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [expandedChatId, setExpandedChatId] = useState(null);
  const [expandedModels, setExpandedModels] = useState([]);
  const [loadingExpandedModels, setLoadingExpandedModels] = useState(false);
  const [selectedViewMode, setSelectedViewMode] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const chatContainerRef = useRef(null);

  // Fetch AI models on mount
  useEffect(() => {
    fetchAImodels();
  }, []);

  // Fetch past chats when sidebar opens
  useEffect(() => {
    if (isSidebarOpen) {
      pastChats();
    }
  }, [isSidebarOpen]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAImodels = async () => {
    try {
      const response = await axios.get("https://unifiedai.onrender.com/api/v1/aiModel/get-models");
      setModels(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch AI models");
      setLoading(false);
    }
  };

  const pastChats = async () => {
    try {
      setLoadingChats(true);
      const token = Cookies.get("unifiedAiAccessToken");
      const response = await axios.post(
        "https://unifiedai.onrender.com/api/v1/chat/get-all-chats",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.data?.chats) {
        setPastHistory(response.data.data.chats);
      } else {
        setPastHistory([]);
      }
      setLoadingChats(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch chat history");
      setLoadingChats(false);
    }
  };

  const expandAIModel = async (chatId) => {
    try {
      setLoadingExpandedModels(true);
      const token = Cookies.get("unifiedAiAccessToken");

      if (expandedChatId === chatId) {
        setExpandedChatId(null);
        setExpandedModels([]);
        setLoadingExpandedModels(false);
        setSelectedViewMode(null);
        return;
      }

      setExpandedChatId(chatId);
      setSelectedViewMode(null);

      const response = await axios.post(
        "https://unifiedai.onrender.com/api/v1/chat/get-used-models-in-chat",
        { chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.data?.usedModels) {
        setExpandedModels(response.data.data.usedModels);
      } else {
        setExpandedModels([]);
      }
      setLoadingExpandedModels(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch models used in this chat");
      setExpandedModels([]);
      setLoadingExpandedModels(false);
    }
  };

  const loadChatHistory = async (chatId, aiModelId = null, isCombined = false, isBestPick = false) => {
    try {
      setCurrentChatId(chatId);
      if (isCombined) setSelectedViewMode("combined");
      else if (isBestPick) setSelectedViewMode("bestPick");
      else if (aiModelId) setSelectedViewMode(aiModelId);

      const token = Cookies.get("unifiedAiAccessToken");
      const response = await axios.post(
        "https://unifiedai.onrender.com/api/v1/chat/get-chat-history",
        { chatId, aiModelId, isCombined, isBestPick },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Transform the history to match the expected format
    
      const transformedMessages = response.data.data.history.map((msg) => ({
        role: msg.role === "model" ? "ai" : msg.role,
        content: msg.parts[0]?.text || "",
      }));
      setMessages(transformedMessages);

      setIsSidebarOpen(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load chat history");
    }
  };

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
      const token = Cookies.get("unifiedAiAccessToken");
      const response = await axios.post(
        "https://unifiedai.onrender.com/api/v1/chat/get-reply-from-ai",
        {
          promptText: currentPrompt,
          selectedTextModels: selectedAPIs, // Reverted to sending the full selectedAPIs array
          chatId: currentChatId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Assuming response.data.data is an array of { modelId, response }
      const aiResponses = response.data.data.promptResponses;

      // Add each AI response to messages (left side)
      aiResponses.forEach((res) => {
        const modelName = getAImodels.find((model) => model.id === res.modelId)?.name || "Unknown Model";
        setMessages((prev) => [...prev, { role: "ai", content: `${modelName}: ${res.responseText}` }]);
      });

      // Update current chat ID if this is a new chat
      if (!currentChatId && response.data.data.chatId) {
        setCurrentChatId(response.data.data.chatId);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch response");
      setMessages((prev) => [...prev, { role: "error", content: "Failed to get response from AI" }]);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setSelectedViewMode(null);
    setIsSidebarOpen(false);
  };

  const handleCheckboxChange = (model) => {
    setSelectedAPIs((prev) => {
      const modelObj = { id: model.ai_model_id, name: model.name }; // Reverted to using ai_model_id
      const exists = prev.some((api) => api.id === modelObj.id);

      if (exists) {
        return prev.filter((api) => api.id !== modelObj.id);
      } else {
        return [...prev, modelObj];
      }
    });
  };

  return (
    <>
      {/* Fixed Buttons */}
      <button
        className="fixed top-4 left-4 bg-white text-black px-4 py-2 rounded hover:scale-105 transition-transform z-50 text-xl cursor-pointer"
        onClick={() => setIsSidebarOpen(true)}
      >
        View Past History
      </button>
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
            <div className="flex flex-col justify-center items-center h-full text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Good Afternoon</h1>
              <p className="text-gray-400 text-lg">How can I assist you today?</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start gap-2 max-w-[70%]">
                  {msg.role === "ai" && (
                    <img
                      src="/ai-avatar.png" // Add your AI avatar image here
                      alt="AI"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <img
                      src="/user-avatar.png" // Add your user avatar image here
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="flex items-center border border-gray-700 bg-gray-900 text-white rounded-full p-2 w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Ask Unified AI anything..."
              className="p-3 flex-grow bg-transparent outline-none text-white placeholder-gray-500"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendPrompt()}
            />
            <button
              className={`p-2 bg-blue-600 rounded-full text-white ${
                selectedAPIs.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Unified AI</h2>
          <button className="text-white hover:text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            ✕
          </button>
        </div>
        <div className="p-4">
          <button
            className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
            onClick={startNewChat}
          >
            New Chat
          </button>
        </div>
        <h3 className="px-4 pt-2 pb-1 text-gray-300 font-semibold">Past Chats</h3>
        {loadingChats ? (
          <div className="p-4 text-center text-gray-400">Loading chats...</div>
        ) : (
          <ul className="p-4 space-y-2">
            {pastHistory.length > 0 ? (
              pastHistory.map((chat) => (
                <div key={chat.chat_id} className="mb-2">
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-300 rounded-t hover:bg-gray-700 hover:text-white transition-all cursor-pointer">
                    <div
                      className="truncate flex-grow"
                      onClick={() => loadChatHistory(chat.chat_id, null, true, false)}
                      title={chat.chat_title || "Untitled Chat"}
                    >
                      <p>{chat.chat_title || "Untitled Chat"}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(chat.created_date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <button
                      className="ml-2 text-gray-300 hover:text-white"
                      onClick={() => expandAIModel(chat.chat_id)}
                    >
                      {expandedChatId === chat.chat_id ? "▲" : "▼"}
                    </button>
                  </div>
                  {expandedChatId === chat.chat_id && (
                    <div className="bg-gray-700 rounded-b px-4 py-2 text-sm">
                      {loadingExpandedModels ? (
                        <p className="text-gray-400">Loading models...</p>
                      ) : expandedModels.length > 0 ? (
                        <div>
                          <p className="text-gray-400 mb-1">Select how to view responses:</p>
                          <ul className="pl-4 space-y-2">
                            <li className="text-gray-300 flex items-center">
                              <input
                                type="radio"
                                name={`viewMode-${chat.chat_id}`}
                                id={`combined-${chat.chat_id}`}
                                className="mr-2"
                                checked={selectedViewMode === "combined" && expandedChatId === chat.chat_id}
                                onChange={() => loadChatHistory(chat.chat_id, null, true, false)}
                              />
                              <label htmlFor={`combined-${chat.chat_id}`}>Combined Responses</label>
                            </li>
                            <li className="text-gray-300 flex items-center">
                              <input
                                type="radio"
                                name={`viewMode-${chat.chat_id}`}
                                id={`bestPick-${chat.chat_id}`}
                                className="mr-2"
                                checked={selectedViewMode === "bestPick" && expandedChatId === chat.chat_id}
                                onChange={() => loadChatHistory(chat.chat_id, null, false, true)}
                              />
                              <label htmlFor={`bestPick-${chat.chat_id}`}>Best Response</label>
                            </li>
                            {expandedModels.map((model) => (
                              <li key={model.id} className="text-gray-300 flex items-center">
                                <input
                                  type="radio"
                                  name={`viewMode-${chat.chat_id}`}
                                  id={`model-${chat.chat_id}-${model.id}`}
                                  className="mr-2"
                                  checked={selectedViewMode === model.id && expandedChatId === chat.chat_id}
                                  onChange={() => loadChatHistory(chat.chat_id, model.id, false, false)}
                                />
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <label htmlFor={`model-${chat.chat_id}-${model.id}`}>
                                  {model.name || "Unknown Model"}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-gray-400">No models found for this chat</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">No past chats found</li>
            )}
          </ul>
        )}
      </div>

      {/* Select API Box */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
        <h3 className="text-xl font-bold mb-2">Select Models</h3>
        {loading ? (
          <p>Loading models...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4 pt-4">
            {getAImodels.map((model) => (
              <div key={model.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={model.id}
                  checked={selectedAPIs.some((api) => api.id === model.ai_model_id)} // Reverted to ai_model_id
                  onChange={() => handleCheckboxChange(model)}
                  className="mr-2"
                />
                <img src={model.logo_secure_url} alt={model.name} className="w-6 h-6 mr-2 rounded-full" />
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