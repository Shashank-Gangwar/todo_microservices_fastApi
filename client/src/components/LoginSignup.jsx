import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const [checkIn, setCheckIn] = useState("Login");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const usernameRef = useRef("");
  const passwordRef = useRef("");

  useEffect(() => {
    handleCookiesLogin();
  }, []);

  const handleCookiesLogin = async () => {
    await axios
      .post(
        "",
        {},
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {
        console.log("Automatic login failed");
      });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
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
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        console.log("response \n", response);
        setLoading(false);
        // setUser(response.data.data);
        navigate("/todo");
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div
      className="form-signin w-100 h-100 m-auto"
      style={{ maxWidth: "500px", paddingTop: "10vh" }}
    >
      <h1 className=" text-center mb-5 pb-5 text-primary">ToDo</h1>
      <form onSubmit={handleOnSubmit}>
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
                placeholder="Password"
              />
              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
            </div>
          )}
          <div className="form-floating mt-1">
            <span className={`${!errorMsg && "d-none"} text-danger ms-1`}>
              error
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
              checkIn === "Signup" ? setCheckIn("Login") : setCheckIn("Signup");
            }}
            style={{ cursor: "pointer" }}
          >
            {checkIn === "Login" ? "Signup?" : "Login."}
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginSignup;
