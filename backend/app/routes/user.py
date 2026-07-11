from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from app.core.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully 🚀",
        "user_id": new_user.id
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token(
        {"sub": db_user.email}
    )

    return {
        "message": "Login Successful 🚀",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "full_name": db_user.full_name,
            "email": db_user.email
        }
    }
@router.delete("/delete/{document_id}")
async def delete_pdf(document_id: str):

    pdf_path = os.path.join(
        "app/uploads",
        document_id
    )

    ocr_path = os.path.join(
        "app/ocr_cache",
        document_id.replace(".pdf", ".txt")
    )

    vector_path = os.path.join(
        "app/vector_db",
        document_id
    )

    deleted = []

    # Delete PDF
    if os.path.exists(pdf_path):
        os.remove(pdf_path)
        deleted.append("PDF")

    # Delete OCR Cache
    if os.path.exists(ocr_path):
        os.remove(ocr_path)
        deleted.append("OCR Cache")

    # Delete FAISS Folder
    if os.path.exists(vector_path):
        shutil.rmtree(vector_path)
        deleted.append("Vector DB")

    return {
        "success": True,
        "deleted": deleted,
        "message": "Document deleted successfully."
    }


@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    return {
        "message": "Protected Route Working ✅",
        "user": current_user
    }