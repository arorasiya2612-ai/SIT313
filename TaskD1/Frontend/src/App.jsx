
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./route/HomePage";
import LoginPage from "./route/LoginPage";
import SignupPage from "./route/SignupPage";
import NewPost from "./route/NewPost";
import PricingPage from "./route/PricingPage";
import "./App.css";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/post" element={<NewPost />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
