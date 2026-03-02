from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pyodbc
import uvicorn
from ai_service import ai_router, init_ai, extract_search_filters

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVER = r'.\SQLEXPRESS'
DATABASE = 'PhongTroDB'
DRIVER = '{ODBC Driver 17 for SQL Server}'

def get_db_connection():
    conn_str = f'DRIVER={DRIVER};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;TrustServerCertificate=yes;'
    return pyodbc.connect(conn_str)

@app.on_event("startup")
async def startup_event():
    init_ai()

@app.get("/")
def read_root():
    return {"message": "Server F-Survival dang chay tron tru!"}

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
    try:
        filters = extract_search_filters(q)
        print("Filters extracted:", filters)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM rooms WHERE 1=1"
        params = []

        if filters.get("max_price"):
            query += " AND price <= ?"
            params.append(filters["max_price"])
            
        if filters.get("min_price"):
            query += " AND price >= ?"
            params.append(filters["min_price"])

        if filters.get("amenities"):
            for amenity in filters["amenities"]:
                query += " AND (utilities LIKE ? OR description LIKE ?)"
                params.extend([f"%{amenity}%", f"%{amenity}%"])

        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return results
    except Exception as e:
        return {"error": str(e)}

app.include_router(ai_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)