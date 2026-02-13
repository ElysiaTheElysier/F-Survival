import pandas as pd
from sqlalchemy import create_engine

from sqlalchemy.types import NVARCHAR 
import urllib


SERVER = r'DESKTOP-81G9JFQ\SQLEXPRESS' 
DATABASE = 'PhongTroDB'
DRIVER = 'ODBC Driver 17 for SQL Server'

params = urllib.parse.quote_plus(f'DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;')
connection_string = f'mssql+pyodbc:///?odbc_connect={params}'
engine = create_engine(connection_string)


excel_file = r"C:\Ki 4\F_Survival\data_tro.xlsx"

try:
    df = pd.read_excel(excel_file)
    

    df = df.rename(columns={
        "ten_tro": "name",
        "dia_chi": "address",
        "gia_tien": "price",
        "dien_tich": "area",
        "tien_ich": "utilities",
        "lien_he": "phone",
        "mo_ta": "description"
    })
    
    df['phone'] = df['phone'].fillna('')


    column_types = {
        'name': NVARCHAR,        
        'address': NVARCHAR,     
        'area': NVARCHAR,        
        'utilities': NVARCHAR,   
        'description': NVARCHAR, 
        'phone': NVARCHAR        
    }


    df.to_sql('rooms', con=engine, index=False, if_exists='replace', dtype=column_types)
    
    print(f" Đã nhập {len(df)} dòng dữ liệu. Tiếng Việt đã hiển thị OK!")

except Exception as e:
    print(f" Lỗi: {e}")