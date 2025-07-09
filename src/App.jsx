import { useState } from "react";
import { Routes, Route } from "react-router-dom";
//updated
import "./App.css";
import UserContext from "./context/userContext";

import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import CommentsDashboard from "./components/Dashboard";

function App() {
  const [userDetails, setUserDetails] = useState({});

  const updateUserDetails = (userData) => {
    setUserDetails(userData);
  };

  return (
    <UserContext.Provider value={{ userDetails, updateUserDetails }}>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/comments-dashboard" element={<CommentsDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
