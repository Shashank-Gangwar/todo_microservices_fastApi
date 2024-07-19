const CreateTodo = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
      <div className="container px-5" style={{ maxWidth: "800px" }}>
        <h1 className="mb-5  fs-2 text-center text-primary">TODO</h1>
        <div className="d-flex align-items-center">
          <input
            type="text"
            class="form-control w-75"
            placeholder="Enter your Todo"
          />
          <button className="btn btn-success ms-1 my-0 w-25">Submit</button>
        </div>
      </div>
      <hr className="hr" />
    </div>
  );
};

export default CreateTodo;
