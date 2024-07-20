import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TodoState } from "../store/TodoContext";

const CreateTodo = () => {
  const titleRef = useRef("");

  const { user, setTodos, todos } = TodoState();

  const handleCreateTodo = async () => {
    const title = titleRef.current.value;
    // console.log(user._id);
    const TodoItem = { title: title, completed: false, userid: user._id };

    await axios
      .post("https://todo-fastapi-todo.onrender.com/todos/create/", TodoItem, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setTodos([...todos, response.data[0]]);
        // console.log(response.data);
        titleRef.current.value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
      <div className="container px-5" style={{ maxWidth: "800px" }}>
        <h1 className="mb-5  fs-2 text-center text-primary">TODO</h1>
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control w-75"
            placeholder="Enter your Todo"
            ref={titleRef}
          />
          <button
            className="btn btn-success ms-1 my-0 w-25"
            onClick={handleCreateTodo}
          >
            Create
          </button>
        </div>
      </div>
      <hr className="hr" />
    </div>
  );
};

export default CreateTodo;
