import React, { createContext, useContext, useState } from "react";

const Todo = createContext();

const TodoContext = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Todo.Provider
      value={{
        loggedIn,
        setLoggedIn,
      }}
    >
      {children}
    </Todo.Provider>
  );
};

export const TodoState = () => {
  return useContext(Todo);
};

export default TodoContext;
