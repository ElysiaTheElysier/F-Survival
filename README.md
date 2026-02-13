\# F-SURVIVAL: Hệ thống hỗ trợ sinh viên FPT (K18-K21)



Dự án hỗ trợ tìm trọ và giải đáp quy chế, giáo trình tự động sử dụng AI Local (Vistral 7B) và SQL Server.



\## 📂 CẤU TRÚC DỰ ÁN 

Anh em lưu ý cấu trúc folder mới đã được refactor, vui lòng \*\*không để file lung tung\*\* ở ngoài root:



\* \*\*`/backend`\*\*: Chứa code Python (FastAPI), file `main.py`, `init\_sqlserver.py` và các script AI (Embedding).

\* \*\*`/frontend`\*\*: Chứa source code React/Vue.

\* \*\*`/data`\*\*: Chứa dữ liệu Excel (.xlsx), Text (.txt, .json) và PDF quy chế.



---



\## 🚀 HƯỚNG DẪN CÀI ĐẶT (SETUP)



\### 1. Chuẩn bị môi trường (Prerequisites)

\* \*\*Python:\*\* 3.10 trở lên.

\* \*\*SQL Server:\*\* Đã cài bản Express hoặc Developer.

\* \*\*Ollama:\*\* Đã cài và pull model `vistral` (cho AI Engineer).

\* \*\*Node.js:\*\* (Cho Frontend).



\### 2. Cài đặt Backend \& AI

Mở Terminal tại thư mục `backend`:





\# B1: Tạo môi trường ảo (Khuyên dùng)

python -m venv venv

\# Windows:

.\\venv\\Scripts\\activate

\# Mac/Linux:

source venv/bin/activate



\# B2: Cài thư viện

pip install -r requirements.txt



