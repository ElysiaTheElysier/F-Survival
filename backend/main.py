from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import pyodbc
import uvicorn
from ai_service import ai_router, init_ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_ai()
    yield

app = FastAPI(title="F-Survival API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVER = r'DESKTOP-81G9JFQ\SQLEXPRESS'
DATABASE = 'PhongTroDB'
DRIVER = 'SQL Server' 

def get_db_connection():
    conn_str = f'DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;'
    return pyodbc.connect(conn_str)

@app.get("/")
def read_root():
    return {"message": "Server F-Survival đang chạy trơn tru!"}

@app.get("/api/rooms")
def get_rooms():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM rooms")
        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return results
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/rooms/search")
def search_rooms(q: str = ""):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = f"SELECT * FROM rooms WHERE name LIKE N'%{q}%' OR address LIKE N'%{q}%'"
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    conn.close()
    return results

app.include_router(ai_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)