from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Server F-Survival dang chay o Nha Moi!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)