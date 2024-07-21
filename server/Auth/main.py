from fastapi import Depends, FastAPI, HTTPException, status,Response,Cookie
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta
from db import users_collection
from fastapi.middleware.cors import CORSMiddleware
from logic import get_password_hash,authenticate_user,create_access_token
from config import ACCESS_TOKEN_EXPIRE_MINUTES

app=FastAPI()

# Cors
origins = [
    "http://localhost:5173",
    "https://todo-fastapi.netlify.app",  # Adjust the port if your frontend runs on a different one
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins from the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)




# User model
class UserInDB(BaseModel):
    username: str
    password: str



# Routes

@app.get("/")
async def healthcheck():
    return {"message":"everything is fine"}


@app.post("/signup")
async def create_user(user: UserInDB,response:Response):
    new_user = user.dict()
    
    if not new_user["username"] or new_user["username"] == "" :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username Invalid",
        )

    if not new_user["password"] or new_user["password"] == "" :
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password Invalid",
        )
    
    # Check if the user already exists based on the userID
    existing_user = users_collection.find_one({"username": new_user["username"]})

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with the provided ID already exists",
        )


    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user["username"]},
        expires_delta=access_token_expires
        )
    
    new_user["access_token"] = access_token

    new_user["password"] = get_password_hash(new_user["password"])

    user=users_collection.insert_one(new_user)
    userId = user.inserted_id
    if not userId:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User Signup Failed. Try Again later.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    
    response.set_cookie('access_token', access_token, ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                        ACCESS_TOKEN_EXPIRE_MINUTES * 60, '/', None, False, True, 'lax')
    
    return {"_id": str(userId),
            "username": new_user["username"],
            "access_token":access_token,
            "message": "User created successfully"
            }





@app.post("/login", response_model=dict)
async def login_for_access_token( response:Response,form_data: OAuth2PasswordRequestForm = Depends()):
    print(form_data)
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )


    auth_user=users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"access_token": access_token}}
    )
    
    if not auth_user.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User Signup Failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


    response.set_cookie('access_token', access_token, ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                        ACCESS_TOKEN_EXPIRE_MINUTES * 60, '/', None, False, True, 'lax')
    return {"_id": str(user["_id"]),
            "username": user["username"],
            "access_token":access_token,
            "message": "User Logged-In successfully"
            }





@app.get("/get_user",response_model=dict)
async def get_user_details(response:Response,access_token: str = Cookie(None)):
    # Check if access_token is present in the cookie
    print(access_token)
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token is missing in the cookie")

    # find the user by access token
    user = users_collection.find_one({"access_token": access_token})

    # If user is not found with the provided access token
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found with the provided access token")

    
    # generating access_token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )

    updated_access_token = users_collection.update_one(
        {"username": user["username"]},
        {"$set": {"access_token": new_access_token}}
    )

    if not updated_access_token.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout Failed"
        )



    # setting cookies in browser
    response.set_cookie('access_token', new_access_token, ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                        ACCESS_TOKEN_EXPIRE_MINUTES * 60, '/', None, False, True, 'lax')


    # Return the user details
    return {
        "username": user["username"],
        "_id": str(user["_id"]),
        "access_token":new_access_token,
        "message": "User Logged-In successfully"
    }




@app.get("/logout/{username}")
async def logout(response: Response,username: str):

    removed_access_token = users_collection.update_one(
        {"username": username},
        {"$set": {"access_token": ""}}
    )

    if not removed_access_token.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout Failed"
        )

    response.delete_cookie("access_token")

    return {"message": "Successfully logged out"}





