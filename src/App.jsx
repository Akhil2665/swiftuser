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
    console.log(userData, "userdaata updt");
  };

  return (
    <UserContext.Provider value={{ userDetails, updateUserDetails }}>
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/comments-dashboard" element={<CommentsDashboard />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
