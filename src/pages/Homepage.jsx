import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/Unified Ai 2.jpg";

import patternimage from "../assets/gettyimages-1401929334-640x640.jpg";
import arrow from "../assets/download (3).png";
import axios from "axios";
import Popup from "../components/Popup";

const Homepage = () => {
  const navigate = useNavigate();

  // State for AI models, loading, and error
  const [getAImodels, setModels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to fetch AI models from the backend
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

  // State for section visibility (animations)
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    howItWorks: false,
    features: false,
    techStack: false,
    builtBy: false, // Added for the new section
    vision: false,
  });

  // useEffect for animations and data fetching
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, hero: true })), 1500),
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, howItWorks: true })), 3000),
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, features: true })), 4500),
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, techStack: true })), 6000),
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, builtBy: true })), 7500), // Animation for new section
      setTimeout(() => setVisibleSections((prev) => ({ ...prev, vision: true })), 9000),
    ];

    // Fetch AI models when the component mounts
    fetchAImodels();

    // Cleanup timers on unmount
    return () => timers.forEach(clearTimeout);
  }, []);


  const handleSearchClick = (e) => {
    e.stopPropagation();
    console.log('handleSearchClick');
    setIsPopupOpen(true);
  };
  
  // Add useEffect to monitor state
  useEffect(() => {
    console.log('isPopupOpen:', isPopupOpen);
  }, [isPopupOpen]);

  return (
    <>
      {/* Render Popup if isPopupOpen is true */}
      {isPopupOpen && <Popup onClose={() => setIsPopupOpen(false)} />}

      {/* Hero section */}
      <section
        className={`relative h-screen bg-center overflow-hidden transition-all duration-1000 ease-in-out ${
          visibleSections.hero ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute top-4 left-0 p-6 text-white text-3xl lg:text-6xl font-bold"
          style={{ letterSpacing: "0.2em" }}
        >
          
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8 w-3/4 max-w-lg">
          <div className="flex items-center border border-gray-300 bg-black text-white rounded-full p-2">
            <input
              type="text"
              placeholder="Ask Unified AI anything..."
              className="p-3 flex-grow bg-black outline-none text-white placeholder-gray-400"
              onClick={handleSearchClick}
            />
            <button className="p-4 bg-[#f5ab51] rounded-full text-white">➝</button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className={`bg-black h-full overflow-hidden scrollbar-hide transition-all duration-1000 ease-in-out ${
          visibleSections.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="mt-10 ml-11">
          <h1 className="text-white text-2xl lg:text-3xl mb-2">
            How <u>UNIFIED AI</u> Works
          </h1>
          <div className="h-screen bg-black">
            <div
              className="mt-10 mr-5 lg:mr-0 lg:ml-7 relative lg:w-full max-w-6xl h-[600px] border border-gray-500 rounded-lg p-6 bg-cover bg-center flex flex-col items-center justify-center"
              style={{
                backgroundImage: `url(${patternimage})`,
                backgroundSize: "cover",
              }}
            >
              <div className="mt-12 lg:mt-0 ml-4 bg-white font-medium lg:text-4xl text-black p-4 rounded-b-xl hover:bg-gradient-to-r from-[#240b36] to-[#c31432] transition duration-300 hover:text-white">
                <h1 className="text-center">Enter your query and select AI models to generate responses.</h1>
              </div>
              <img src={arrow} alt="arrow" className="w-16 h-16 my-4" />
              <div className="mt-12 lg:mt-0 ml-4 bg-white font-medium lg:text-3xl text-black p-4 rounded-b-xl hover:bg-gradient-to-r from-[#240b36] to-[#c31432] transition duration-300 hover:text-white">
                <h1 className="text-center">Choose 'Combine' for mixed responses or 'Best Pick' for accuracy.</h1>
              </div>
              <img src={arrow} alt="arrow" className="w-16 h-16 my-4" />
              <div className="mt-12 lg:mt-0 ml-4 bg-white font-medium lg:text-3xl text-black p-4 rounded-b-xl hover:bg-gradient-to-r from-[#240b36] to-[#c31432] transition duration-300 hover:text-white">
                <h1 className="text-center">Dynamically add or remove AI models for each unique query.</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`bg-black py-16 text-white transition-all duration-1000 ease-in-out ${
          visibleSections.features ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <h1 className="text-3xl mb-10 text-center">Why UNIFIED AI is So Different</h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-4 lg:p-0">
          <div className="bg-gradient-to-r from-gray-300 to-zinc-900 p-6 rounded-xl transition duration-300">
            <h1 className="font-bold mb-4 text-4xl text-black">Fastest</h1>
            <p className="text-black text-2xl pt-3">Get instant responses with optimized AI processing speed.</p>
          </div>
          <div className="bg-gradient-to-r from-gray-300 to-zinc-900 p-6 rounded-xl transition duration-300">
            <h1 className="font-bold mb-4 text-4xl text-black">Combine Response</h1>
            <p className="text-black text-2xl pt-3">Merge insights from multiple AI models into one response.</p>
          </div>
          <div className="bg-gradient-to-r from-gray-300 to-zinc-900 p-6 rounded-xl transition duration-300">
            <h1 className="font-bold mb-4 text-4xl text-black">Best Pick</h1>
            <p className="text-black text-2xl pt-3">Select the most accurate and relevant AI-generated answer</p>
          </div>
          <div className="bg-gradient-to-r from-gray-300 to-zinc-900 p-6 rounded-xl transition duration-300">
            <h1 className="font-bold mb-4 text-4xl text-black">Best Use for Research</h1>
            <p className="text-black text-2xl pt-3">Leverage AI to assist in deep research and knowledge gathering.</p>
          </div>
          <div className="bg-gradient-to-r from-gray-300 to-zinc-900 p-6 rounded-xl transition duration-300">
            <h1 className="font-bold mb-4 text-4xl text-black">No Need for Multiple AI</h1>
            <p className="text-black text-2xl pt-3">Access all AI capabilities in one unified platform.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section
        className={`bg-black py-16 text-white p-5 lg:p-0 transition-all duration-1000 ease-in-out ${
          visibleSections.techStack ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <h1 className="text-xl lg:text-3xl mb-8 ml-12">Tech Stack Used in UNIFIED AI</h1>
        <div
          className="relative w-full max-w-6xl mx-auto p-6 bg-cover bg-center rounded-xl border border-gray-500"
          style={{ backgroundImage: `url(${patternimage})` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:p-6 p-4">
            <div className="p-6 border border-gray-600 rounded-lg bg-white text-black hover:bg-gradient-to-r from-[#240b36] to-[#c31432] transition duration-300 hover:text-white">
              <h1 className="text-2xl font-bold">Frontend</h1>
              <p className="mt-3">React and Tailwind CSS for sleek UI & responsiveness.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg bg-white text-black hover:bg-gradient-to-r from-[#240b36] to-[#c31432] transition duration-300 hover:text-white">
              <h1 className="text-2xl font-bold">Backend</h1>
              <p className="mt-3">Express and Node.js to handle server-side logic efficiently.</p>
            </div>
            <div className="p-6 border border-gray-600 rounded-lg bg-white text-black hover:bg-gradient-to-r from-[#240b36] to-[#c31432] transition duration-300 hover:text-white">
              <h1 className="text-2xl font-bold">Database</h1>
              <p className="mt-3">Postgre SQL for scalable and flexible data storage solutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* UNIFIED AI built by Section */}
      <section
        className={`bg-black py-16 text-white transition-all duration-1000 ease-in-out ${
          visibleSections.builtBy ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <h1 className="text-3xl mb-10 text-center">UNIFIED AI built by</h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-4 lg:p-0">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : getAImodels ? (
            getAImodels.map((model) => (
              <div
                key={model.ai_model_id}
                className="bg-gradient-to-r from-gray-300 to-zinc-900 p-6 rounded-xl transition duration-300 flex flex-col items-center"
              >
                <img src={model.logo_secure_url} alt={model.name} className="w-20 h-20 mb-4 rounded-full" />
                <h2 className="text-4xl font-bold text-black">{model.name}</h2>
              </div>
            ))
          ) : (
            <p className="text-center">No models available</p>
          )}
        </div>
      </section>

      {/* Vision Section */}
      <div
        className={`bg-black text-center pb-5 font-bold transition-all duration-1000 ease-in-out lg:pt-7 ${
          visibleSections.vision ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <h1 className="text-xl lg:text-4xl bg-gradient-to-r from-violet-800 to-red-600 bg-clip-text text-transparent">
          Our vision is to integrate AI models
        </h1>
        <h1 className="text-xl lg:text-4xl bg-gradient-to-r from-violet-800 to-red-600 bg-clip-text text-transparent mt-2">
          seamlessly for accurate and efficient responses.
        </h1>
      </div>
    </>
  );
};

export default Homepage;