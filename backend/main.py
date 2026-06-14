from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
from routers import auth, users, shifts, logs

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Shifts API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(shifts.router, prefix="/shifts", tags=["Shifts"])
app.include_router(logs.router, prefix="/logs", tags=["Logs"])

@app.get("/")
def read_root():
    return {"message": "Shifts API"}
