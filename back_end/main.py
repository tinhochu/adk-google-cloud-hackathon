import os
from fastapi import FastAPI, Request, APIRouter
from google.adk.cli.fast_api import get_fast_api_app
from pydantic import BaseModel
from celery.result import AsyncResult
from back_end.tasks import run_agent_task  # Your Celery-triggered MCP entry

# ---- Setup base paths ----
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
AGENT_DIR = BASE_DIR  # Points to directory containing multi_tool_agent/
SESSION_DB_URL = f"sqlite:///{os.path.join(BASE_DIR, 'sessions.db')}"

# ---- Initialize ADK-backed FastAPI app ----
app: FastAPI = get_fast_api_app(
    agent_dir=AGENT_DIR,
    session_db_url=SESSION_DB_URL,
    allow_origins=["*"],  # CORS (restrict in production)
    web=False  # Set to True to enable ADK's built-in web UI
)

# ---- Optional: define your input model ----
class TaskInput(BaseModel):
    inputText: str
    tone: str = "funny, Gen Z"
    platform: str = "TikTok"

# ---- Create custom API routes ----
custom_router = APIRouter()

@custom_router.post("/")
def start_task(payload: TaskInput):
    # Trigger your Celery pipeline
    result = run_agent_task.delay(payload.dict())
    return {"task_id": result.id, "status": "started"}

@custom_router.get("/tasks/{task_id}")
def check_status(task_id: str):
    result = AsyncResult(task_id)
    return {
        "state": result.state,
        "result": result.result if result.successful() else None
    }

# ---- Mount custom routes under /api ----
app.include_router(custom_router, prefix="/api")
