import pandas as pd
from sqlalchemy import create_engine
# 1. THÊM DÒNG IMPORT NÀY ĐỂ HỖ TRỢ TIẾNG VIỆT
from sqlalchemy.types import NVARCHAR 
import urllib

# --- CẤU HÌNH KẾT NỐI ---
SERVER = r'DESKTOP-81G9JFQ\SQLEXPRESS' # Tên server của bạn
DATABASE = 'PhongTroDB'
DRIVER = 'ODBC Driver 17 for SQL Server'

params = urllib.parse.quote_plus(f'DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};Trusted_Connection=yes;')
connection_string = f'mssql+pyodbc:///?odbc_connect={params}'
engine = create_engine(connection_string)

# --- ĐỌC FILE VÀ XỬ LÝ ---
excel_file = r"C:\Ki 4\F_Survival\data_tro.xlsx"

try:
    df = pd.read_excel(excel_file)
    
    # Đổi tên cột chuẩn
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

    # --- QUAN TRỌNG NHẤT: ÉP KIỂU DỮ LIỆU SANG NVARCHAR ---
    # Chỉ định rõ cột nào là chữ tiếng Việt để SQL Server không bị lỗi font
    column_types = {
        'name': NVARCHAR,        # Tên trọ -> Tiếng Việt
        'address': NVARCHAR,     # Địa chỉ -> Tiếng Việt
        'area': NVARCHAR,        # Diện tích
        'utilities': NVARCHAR,   # Tiện ích -> Tiếng Việt
        'description': NVARCHAR, # Mô tả -> Tiếng Việt
        'phone': NVARCHAR        # Số điện thoại (lưu dạng chữ cho an toàn)
    }

    # Đẩy dữ liệu vào với tham số dtype
    df.to_sql('rooms', con=engine, index=False, if_exists='replace', dtype=column_types)
    
    print(f"✅ Đã nhập {len(df)} dòng dữ liệu. Tiếng Việt đã hiển thị OK!")

except Exception as e:
    print(f"❌ Lỗi: {e}")