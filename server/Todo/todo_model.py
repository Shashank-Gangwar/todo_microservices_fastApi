from pydantic import BaseModel


#decribed model for the collection
class TodoItem(BaseModel):
    title:str
    completed: bool=False
    userid: str = ""
