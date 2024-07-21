import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TodoState } from "../store/TodoContext";
import Loader from "./Loader";

const LoginSignup = () => {
  const [checkIn, setCheckIn] = useState("Login");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, user, setTodos, setLoggedIn } = TodoState();

  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  // useEffect(() => {
  //   handleCookiesLogin();
  // }, []);

  // const handleCookiesLogin = async () => {
  //   await axios
  //     .post(
  //       "",
  //       {},
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then(function (response) {
  //       // console.log(response);
  //     })
  //     .catch((error) => {
  //       // console.log("Automatic login failed");
  //     });
  // };

  const handleOnsubmit = (event) => {
    event.preventDefault();
    if (checkIn === "Login") {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleLogin = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    if (password.length < 6) {
      setErrorMsg(
        "Invalid Password! Password should have at least 6 characters "
      );
      passwordRef.current.value = "";
      return;
    }

    setErrorMsg("");
    const loginDetails = { username: username, password: password };

    passwordRef.current.value = "";

    setLoading(true);
    await axios
      .post("https://todo-fastapi-auth.onrender.com/login", loginDetails, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(function (response) {
        // console.log("response \n", response);
        handleGetTodos(response.data);
        setUser(response.data);
        setLoggedIn(true);
        setLoading(false);
        navigate("/todo");
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const handleSignup = async () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password.length < 6) {
      setErrorMsg(
        "Invalid Password! Password should have at least 6 characters "
      );
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("confirm password doesn't match.");
      passwordRef.current.value = "";
      confirmPasswordRef.current.value = "";
      return;
    }

    setErrorMsg("");
    const loginDetails = { username: username, password: password };

    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";

    setLoading(true);

    const url = await axios
      .post(
        "https://todo-fastapi-auth.onrender.com/signup",

        loginDetails,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        // console.log("response \n", response);
        handleGetTodos(response.data);
        setUser(response.data);
        setLoggedIn(true);
        setLoading(false);
        navigate("/todo");
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const handleGetTodos = async (data) => {
    console.log(data);

    await axios
      .get(
        `https://todo-fastapi-todo.onrender.com/todos/get/${data._id}`,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(function (response) {
        console.log("response \n", response);
        setTodos(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div
        className={`${
          loading ? "d-flex" : "d-none"
        } align-items-center justify-content-center position-absolute bg-light bg-opacity-75`}
        style={{ width: "100vw", height: "100vh", zIndex: "999" }}
      >
        <Loader />
      </div>

      <div
        className="form-signin w-100 h-100 m-auto"
        style={{ maxWidth: "500px", paddingTop: "10vh" }}
      >
        <h1 className=" text-center mb-5 pb-5 text-primary">ToDo</h1>
        <form onSubmit={handleOnsubmit} className="mx-5">
          <h1 className="h3 mb-3 fw-normal">{checkIn}</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control mb-2"
              id="floatingInput"
              placeholder="name"
              ref={usernameRef}
            />
            <label htmlFor="floatingInput">UserName</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              ref={passwordRef}
            />
            <label htmlFor="floatingPassword">Password</label>

            {checkIn === "Signup" && (
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control mt-2"
                  id="floatingConfirmPassword"
                  placeholder="ConfirmPassword"
                  ref={confirmPasswordRef}
                />
                <label htmlFor="floatingConfirmPassword">
                  Confirm Password
                </label>
              </div>
            )}
            <div className="form-floating mt-1">
              <span className={`${!errorMsg && "d-none"} text-danger ms-1`}>
                {errorMsg}
              </span>
            </div>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            Submit
          </button>
          <p className="mt-5 mb-3 text-body-secondary text-end">
            {checkIn === "Login" ? "New User?" : "Already have an Account?"}{" "}
            <a
              className="text-decoration-none pointer-cursor"
              onClick={() => {
                checkIn === "Signup"
                  ? setCheckIn("Login")
                  : setCheckIn("Signup");
                setErrorMsg("");
              }}
              style={{ cursor: "pointer" }}
            >
              {checkIn === "Login" ? "Signup?" : "Login."}
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginSignup;
