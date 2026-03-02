from fastapi import APIRouter
from pydantic import BaseModel
import os
import json
import re
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

ai_router = APIRouter()
vectorstore = None
llm = None

def init_ai():
    global vectorstore, llm
    
    llm = OllamaLLM(model="vistral", temperature=0.1)
    embeddings = HuggingFaceEmbeddings(model_name="keepitreal/vietnamese-sbert")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(base_dir)
    index_path = os.path.join(base_dir, "faiss_index")
    
    possible_paths = [
        os.path.join(base_dir, "fpt_full_data.md"),
        os.path.join(parent_dir, "fpt_full_data.md"),
        os.path.join(parent_dir, "data", "fpt_full_data.md"),
        "fpt_full_data.md"
    ]
    
    md_path = None
    for p in possible_paths:
        if os.path.exists(p):
            md_path = p
            break
            
    if not md_path:
        raise FileNotFoundError("Khong tim thay file fpt_full_data.md")
        
    if os.path.exists(index_path):
        vectorstore = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
    else:
        headers_to_split_on = [("#", "Phần"), ("##", "Chương"), ("###", "Mục")]
        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        with open(md_path, "r", encoding="utf-8") as f:
            txt_content = f.read()
        md_docs = markdown_splitter.split_text(txt_content)
        vectorstore = FAISS.from_documents(md_docs, embeddings)
        vectorstore.save_local(index_path)

class QuestionRequest(BaseModel):
    content: str

@ai_router.post("/api/chat")
async def chat_with_ai(request: QuestionRequest):
    global vectorstore, llm
    if not vectorstore or not llm:
        return {"answer": "AI dang ngu, vui long thu lai sau!", "sources": []}
        
    docs = vectorstore.similarity_search(request.content, k=5)
    context = ""
    sources = []
    for doc in docs:
        context += f"- {doc.page_content}\n\n"
        source_name = " > ".join(doc.metadata.values()) if doc.metadata else "Tài liệu Đại học FPT"
        if source_name not in sources:
            sources.append(source_name)

    prompt_template = PromptTemplate(
        input_variables=["context", "question"],
        template="""<s>[INST] <<SYS>>
Bạn là F-Survival, trợ lý ảo thông minh cho sinh viên Đại học FPT. 
Xưng "mình" và "bạn". Trình bày rõ ràng.

QUY TẮC:
1. CHỈ DỰA VÀO TÀI LIỆU dưới đây để trả lời.
2. Tóm tắt tự nhiên, dễ hiểu.
3. Nếu không có thông tin, hãy nói chưa cập nhật và khuyên hỏi Phòng Dịch vụ sinh viên.
<</SYS>>

TÀI LIỆU:
{context}

CÂU HỎI: {question} [/INST]"""
    )

    chain = prompt_template | llm
    response = chain.invoke({"context": context, "question": request.content})

    return {
        "answer": response,
        "sources": sources
    }

json_extraction_prompt = PromptTemplate(
    input_variables=["user_input"],
    template="""<s>[INST] <<SYS>>
Bạn là hệ thống trích xuất dữ liệu phòng trọ. 
Chỉ trả về JSON, TUYỆT ĐỐI KHÔNG giải thích.

Quy tắc TỐI QUAN TRỌNG:
1. Tiền tệ: "củ", "triệu" = 1000000. Ví dụ "1 triệu 5" -> 1500000.
2. Từ khóa tiện ích: Người dùng gõ từ gì, lấy ĐÚNG từ đó. Ví dụ họ gõ "nội thất đầy đủ" hoặc "full đồ", CHỈ lấy "nội thất đầy đủ" hoặc "full đồ". TUYỆT ĐỐI KHÔNG tự suy diễn thành danh sách (điều hòa, nóng lạnh...).

Cấu trúc:
{{
  "max_price": (số hoặc null),
  "min_price": (số hoặc null),
  "amenities": [(các từ khóa xuất hiện trong câu)]
}}
<</SYS>>
Câu tìm kiếm: "{user_input}" [/INST]"""
)

def extract_search_filters(user_input: str):
    global llm
    if not llm:
        return {"max_price": None, "min_price": None, "amenities": []}
    
    try:
        raw_result = llm.invoke(json_extraction_prompt.format(user_input=user_input))
        match = re.search(r'\{.*\}', raw_result, re.DOTALL)
        if match:
            clean_json = match.group(0)
            return json.loads(clean_json)
    except Exception:
        pass
        
    return {"max_price": None, "min_price": None, "amenities": []}