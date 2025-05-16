import os
from fastapi import FastAPI, Request
from google.adk.cli.fast_api import get_fast_api_app
from pydantic import BaseModel
from .multi_tool_agent.agent import root_agent  # Adjust import as needed
from celery.result import AsyncResult
from back_end.tasks import run_agent_task

# Set up paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
AGENT_DIR = BASE_DIR  # Parent directory containing multi_tool_agent

# Set up DB path for sessions
SESSION_DB_URL = f"sqlite:///{os.path.join(BASE_DIR, 'sessions.db')}"

# Create the FastAPI app using ADK's helper
app: FastAPI = get_fast_api_app(
    agent_dir=AGENT_DIR,
    session_db_url=SESSION_DB_URL,
    allow_origins=["*"],  # In production, restrict this
    web=False,  # Enable the ADK Web UI
)

# Define your request/response models
class AgentInput(BaseModel):
    app_name: str
    user_id: str
    session_id: str
    new_message: str

class AgentOutput(BaseModel):
    response: str

class TaskCreateInput(BaseModel):
    new_message: str

class TaskCreateOutput(BaseModel):
    task_id: str

class TaskResultOutput(BaseModel):
    status: str
    result: str | None = None

@app.post("/run", response_model=AgentOutput)
async def run_agent(input: AgentInput):
    # Use input.new_message as the user input
    result = root_agent.run(input.new_message)
    return AgentOutput(response=result)

@app.post("/queue_task", response_model=TaskCreateOutput)
async def queue_task(input: TaskCreateInput):
    task = run_agent_task.delay(input.new_message)
    return TaskCreateOutput(task_id=task.id)

@app.get("/task_result/{task_id}", response_model=TaskResultOutput)
async def get_task_result(task_id: str):
    task = AsyncResult(task_id)
    result = task.result if task.successful() else None
    return TaskResultOutput(status=task.status, result=result)