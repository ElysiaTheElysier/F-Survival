
# F-SURVIVAL: Hệ thống hỗ trợ sinh viên FPT (K18-K21)

Dự án hỗ trợ tìm trọ và giải đáp quy chế, giáo trình tự động sử dụng AI Local (Vistral 7B) và SQL Server.

## 📂 CẤU TRÚC DỰ ÁN (MỚI)
Anh em lưu ý cấu trúc folder mới đã được refactor, vui lòng **không để file lung tung** ở ngoài root:

* **`/backend`**: Chứa code Python (FastAPI), file `main.py`, `init_sqlserver.py` và các script AI (Embedding).
* **`/frontend`**: Chứa source code React/Vue.
* **`/data`**: Chứa dữ liệu Excel (.xlsx), Text (.txt, .json) và PDF quy chế.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT (SETUP)

### 1. Chuẩn bị môi trường (Prerequisites)
* **Python:** 3.10 trở lên.
* **SQL Server:** Đã cài bản Express hoặc Developer.
* **Ollama:** Đã cài và pull model `vistral` (cho AI Engineer).
* **Node.js:** (Cho Frontend).

### 2. Cài đặt Backend & AI
Mở Terminal tại thư mục `backend`:

```bash
# B1: Tạo môi trường ảo (Khuyên dùng)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# B2: Cài thư viện
pip install -r requirements.txt

```

### 3. Cấu hình Database

* Đảm bảo SQL Server đang chạy.
* Mở file `backend/init_sqlserver.py`, sửa dòng `SERVER` thành tên máy của bạn nếu cần.
* Chạy lệnh nạp dữ liệu:
```bash
python init_sqlserver.py

```



---

## ▶️ HƯỚNG DẪN CHẠY (RUN)

### Chạy Backend API

Tại thư mục `backend`, chạy lệnh:

```bash
uvicorn main:app --reload

```

* API sẽ chạy tại: `http://localhost:8000`
* Swagger Docs (Test API): `http://localhost:8000/docs`

### Chạy Frontend

Tại thư mục `frontend`:

```bash
npm install
npm run dev

```

---

## ⚠️ QUY TẮC GIT (BẮT BUỘC ĐỌC)

Để tránh lỗi không push được code, anh em tuân thủ:

1. **Luôn Pull trước khi làm:**
```bash
git pull origin main

```


2. **Làm việc đúng folder:**
* Ông Frontend chỉ sửa trong `/frontend`.
* Ông Data/AI chỉ sửa trong `/backend` và `/data`.


3. **File `backend/main.py`:** Đây là file chung. Nếu ông AI thêm API mới, hãy báo lên nhóm trước khi Push hoặc tách ra file router riêng (ví dụ `rag_router.py`).

---
