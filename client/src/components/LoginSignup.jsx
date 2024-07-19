import { useState } from "react";

const LoginSignup = () => {
  const [checkIn, setCheckIn] = useState("Login");
  const [errorMsg, setErrorMsg] = useState(false);

  return (
    <div
      class="form-signin w-100 h-100 m-auto"
      style={{ maxWidth: "500px", paddingTop: "10vh" }}
    >
      <h1 className=" text-center mb-5 pb-5 text-primary">ToDo</h1>
      <form>
        <h1 class="h3 mb-3 fw-normal">{checkIn}</h1>

        <div class="form-floating">
          <input
            type="text"
            class="form-control mb-2"
            id="floatingInput"
            placeholder="name"
          />
          <label for="floatingInput">UserName</label>
        </div>
        <div class="form-floating mb-4">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label for="floatingPassword">Password</label>

          {checkIn === "Signup" && (
            <div class="form-floating">
              <input
                type="password"
                class="form-control mt-2"
                id="floatingConfirmPassword"
                placeholder="Password"
              />
              <label for="floatingConfirmPassword">Confirm Password</label>
            </div>
          )}
          <div class="form-floating mt-1">
            <span className={`${!errorMsg && "d-none"} text-danger ms-1`}>
              error
            </span>
          </div>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit">
          Submit
        </button>
        <p class="mt-5 mb-3 text-body-secondary text-end">
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
