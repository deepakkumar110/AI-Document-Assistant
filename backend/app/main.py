from fastapi import FastAPI
from app.db.database import Base, engine
from app.models.user import User
from app.routes.user import router as user_router
from app.routes.pdf import router as pdf_router

app = FastAPI(
    title="AI Document Assistant API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

# Register Routes
app.include_router(user_router)
app.include_router(pdf_router)

@app.get("/")
def home():
    return {
        "message": "Backend Running 🚀"
    }