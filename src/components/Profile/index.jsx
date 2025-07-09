import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { ArrowLeftFromLine } from "lucide-react";

export default function Profile() {
  const [userData, setuserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      const reponse = await fetch("https://jsonplaceholder.typicode.com/users");
      const usersData = await reponse.json();
      const data = usersData[1];
      // console.log(data);
      const formattedData = {
        userId: data.id,
        name: data.name,
        email: data.email,
        address: `${data.address.street} ${data.address.suite} ${data.address.city} ${data.address.zipcode}`,
        phone: data.phone,
      };
      setuserData(formattedData);
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }
  const userAvatar = userData
    ? userData.name.split(" ")[0][0].toUpperCase() +
      userData.name.split(" ")[1][0].toUpperCase()
    : "P";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Link
            to="/comments-dashboard"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftFromLine className="mr-2" />
          </Link>
          <p className="text-lg text-gray-700 mb-6 fle">
            {`Welcome, ${userData.name}`}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
              {userAvatar}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500 block mb-1">User ID</label>
              <input
                type="text"
                value={userData.userId}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Name</label>
              <input
                type="text"
                value={userData.name}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Email</label>
              <input
                type="text"
                value={userData.email}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Address</label>
              <input
                type="text"
                value={userData.address}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2 "
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Phone</label>
              <input
                type="text"
                value={userData.phone}
                readOnly
                className="w-full bg-gray-100 border border-gray-200 rounded px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
