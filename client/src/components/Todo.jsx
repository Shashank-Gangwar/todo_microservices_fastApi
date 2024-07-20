import CreateTodo from "./CreateTodo";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { TodoState } from "../store/TodoContext";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Todo = () => {
  const [edit, setEdit] = useState(false);
  const [editTodo, setEditTodo] = useState({});
  const [error, setError] = useState("");
  const { user, todos, loggedIn, setTodos } = TodoState();
  const navigate = useNavigate();

  const editTodoRef = useRef("");

  useEffect(() => {
    // console.log(todos);
    !loggedIn && navigate("/login");
  }, []);

  const handleDeleteItem = async (todo_id) => {
    // console.log(todo_id);

    await axios
      .delete(
        `https://todo-fastapi-todo.onrender.com/todos/delete/${todo_id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        const newTodos = todos.filter((todo) => {
          return todo.id !== todo_id && todo;
        });
        setTodos(newTodos);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditTodo = async (event) => {
    event.preventDefault();

    const new_title = editTodoRef.current.value;

    if (new_title === "") {
      setError("Please enter todo!");
      return;
    }

    setError("");

    const TodoItem = {
      title: new_title,
      completed: editTodo.completed,
      userid: editTodo.userid,
    };

    await axios
      .put(
        `https://todo-fastapi-todo.onrender.com/todos/edit/${editTodo.id}`,
        TodoItem,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === editTodo.id) {
            todo.title = new_title;
          }
          return todo;
        });
        // console.log(updatedTodos);
        // setTodos([...todos, response.data[0]]);
        // console.log(response.data);
        // titleRef.current.value = "";
        setEdit(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Error! Unable to make changes.");
      });
  };
  // console.log(todos);

  return edit ? (
    <div
      className="w-100 d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="modal-content rounded-4 shadow p-3 mx-2"
        style={{ maxWidth: "400px" }}
      >
        <div className="modal-body py-0 my-3 w-100 d-flex justify-content-center">
          <input
            type="text"
            className="form-control w-100 "
            placeholder="Edit your Todo"
            ref={editTodoRef}
          />
        </div>
        <span className="text-danger mb-2 ms-2">{error}</span>
        <div className="modal-footer w-100 gap-2 pb-3 border-top-0">
          <button className="btn  btn-primary" onClick={handleEditTodo}>
            Save changes
          </button>
          <button className="btn  btn-secondary" onClick={() => setEdit(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  ) : (
    <>
      <CreateTodo />
      <div className="d-flex flex-column flex-md-row p-4 py-md-5 align-items-center justify-content-center ">
        <div className="list-group container">
          {todos[0] == undefined ? (
            <h3 className="text-center">Hi! Create your first Todo</h3>
          ) : (
            todos.map((todo_item, index) => {
              return (
                <span
                  className="list-group-item list-group-item-action d-flex mx-auto"
                  style={{ maxWidth: "800px", width: "100%" }}
                  key={index}
                >
                  <div className="d-flex gap-2 w-100 justify-content-between align-items-center">
                    <label className="form-check-label">
                      {todo_item.title}
                    </label>
                    <div className="d-flex">
                      <button
                        className=" btn btn-outline-primary border-0 text-nowrap fs-4 px-2 pt-0 pb-1 me-2"
                        onClick={() => {
                          setEdit(true);
                          setEditTodo(todo_item);
                        }}
                      >
                        <CiEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger border-0  text-nowrap fs-4 px-2 pt-0 pb-1"
                        onClick={() => handleDeleteItem(todo_item.id)}
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </div>
                </span>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Todo;
