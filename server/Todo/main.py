from fastapi import FastAPI,HTTPException
from todo_model import TodoItem
from db import todos_collection
from todo_schema import list_serial
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



origins = [
    "http://localhost:5173",
    "http://127.0.0.1:3000",  # Adjust the port if your frontend runs on a different one
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins from the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)







# Routes

# Get all Todo items
@app.get("/todos/get/{userid}")
async def get_all_todos(userid:str):
    todos =  list_serial(todos_collection.find({"userid": str(userid)}))
    print(todos)
    if not todos:
        print("not"                  ,todos)
    return todos



# Create a new Todo item
@app.post("/todos/create/")
async def create_todo(todo_item: TodoItem):
    print(todo_item)
    result = todos_collection.insert_one(dict(todo_item))
    todo_item_id = result.inserted_id
    todo_item = list_serial(todos_collection.find({"_id": ObjectId(todo_item_id)}))

    return  todo_item




# Update a Todo item by ID
@app.put("/todos/edit/{todo_id}")
async def update_todo(todo_id: str, todo_item: TodoItem):
    result = todos_collection.update_one(
        {"_id": ObjectId(todo_id)}, {"$set": todo_item.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return todo_item




# Delete a Todo item by ID
@app.delete("/todos/delete/{todo_id}")
async def delete_todo(todo_id: str):
    print(todo_id)
    result = todos_collection.delete_one({"_id": ObjectId(todo_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo item not found")
    return {"message": "Todo item deleted successfully"}



