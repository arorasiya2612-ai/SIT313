import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./route/HomePage";
import LoginPage from "./route/LoginPage";
import SignupPage from "./route/SignupPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
     <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;