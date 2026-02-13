from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pyodbc
import uvicorn
from pydantic import BaseModel

app = FastAPI()


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

# 3. CÁC API

@app.get("/")
def read_root():
    return {"message": "Server Phòng Trọ đang chạy và kết nối SQL Server thành công!"}


@app.get("/api/rooms")
def get_rooms():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        

        cursor.execute("SELECT * FROM rooms")
        

        columns = [column[0] for column in cursor.description]
        results = []
        for row in cursor.fetchall():
            results.append(dict(zip(columns, row)))
            
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

class QuestionRequest(BaseModel):
    content: str

@app.post("/api/chat")
async def chat_with_ai(request: QuestionRequest):

    user_question = request.content
    return {
        "answer": f"Tôi đang xử lý câu hỏi: '{user_question}'. (Hiện tại AI chưa được tích hợp, đây là tin nhắn mẫu từ Server).",
        "sources": ["Tài liệu demo 1", "Tài liệu demo 2"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)