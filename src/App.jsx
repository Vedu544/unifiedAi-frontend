import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";

import Layout from "./components/Layout";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
      </Route>
    </Routes>
  );
}

export default App;
