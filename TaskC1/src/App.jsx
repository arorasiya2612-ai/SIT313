
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./route/HomePage";
import LoginPage from "./route/LoginPage";
import SignupPage from "./route/SignupPage";
import NewPost from "./route/NewPost";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/post" element={<NewPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
