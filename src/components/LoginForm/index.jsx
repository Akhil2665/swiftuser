import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { updateUserDetails } = useContext(UserContext);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const usersData = await response.json();
    const data = usersData[0];

    const formattedData = {
      userId: data.id,
      name: data.name,
      email: data.email,
      address: `${data.address.street} ${data.address.suite} ${data.address.city} ${data.address.zipcode}`,
      phone: data.phone,
    };
    setUser(formattedData);
    console.log(formattedData);
  };

  useEffect(() => {
    if (user) {
      updateUserDetails(user);
      navigate("/", { replace: true });
    }
  }, [user, updateUserDetails, navigate]);

  const onClickedLogin = () => {
    fetchUserData();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          onClick={onClickedLogin}
        >
          Login as Guest
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
