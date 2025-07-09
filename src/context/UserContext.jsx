import React from "react";

const UserContext = React.createContext({
  userDetails: {},
  updateUserDetails: () => {},
});

export default UserContext;
