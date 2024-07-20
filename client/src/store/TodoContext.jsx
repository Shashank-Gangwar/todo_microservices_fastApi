import React, { createContext, useContext, useState } from "react";

const Todo = createContext();

const TodoContext = ({ children }) => {
  const [user, setUser] = useState({});
  const [todos, setTodos] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Todo.Provider
      value={{
        user,
        setUser,
        todos,
        setTodos,
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
