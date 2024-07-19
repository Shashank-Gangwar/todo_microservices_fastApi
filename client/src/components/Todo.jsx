import CreateTodo from "./CreateTodo";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const Todo = () => {
  return (
    <>
      <CreateTodo />
      <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
        <div class="list-group">
          <span
            class="list-group-item list-group-item-action d-flex gap-3"
            style={{ maxWidth: "800px" }}
          >
            <div class="d-flex gap-2 w-100 justify-content-between align-items-center">
              <div class="form-check me-5 ">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="todo_item"
                />
                <label class="form-check-label" for="todo_item">
                  Shopping address is the same as my billing address
                </label>
              </div>

              <button class=" btn btn-outline-primary border-0 text-nowrap fs-4 px-2 pt-0 pb-1">
                <CiEdit />
              </button>
              <button class="btn btn-outline-danger border-0  text-nowrap fs-4 px-2 pt-0 pb-1">
                <MdDeleteOutline />
              </button>
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default Todo;
