import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./index.css";
import UserContext from "../../context/UserContext";

export default function Navbar() {
  const { userDetails } = useContext(UserContext);
  console.log(userDetails, "asdkkahd");

  return (
    <nav className="bg-[#1a1f36] text-white flex justify-between items-center px-6 py-4">
      <div className="text-xl font-bold flex items-center gap-2">
        <span className="slanted-shape bg-green-600 px-3 py-1 scale-140 trasform-gpu">
          S
        </span>
        <span className="text-white px-0">WIFT</span>
      </div>
      <Link className="flex items-center gap-2" to="/profile">
        <div className="bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold">EH</span>
        </div>
        <span>Ervin Howell</span>
      </Link>
    </nav>
  );
}
