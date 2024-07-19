import "bootstrap/dist/css/bootstrap.min.css";
import TodoContext from "./store/TodoContext";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <TodoContext>
      <Outlet />
    </TodoContext>
  );
}

export default App;
