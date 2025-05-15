from typing import Union

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from back_end.tasks import add
from back_end.celery_app import celery_app

app = FastAPI()

class AddRequest(BaseModel):
    x: int
    y: int

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/add")
async def add_numbers(request: AddRequest):
    print(request)
    task = add.delay(request.x, request.y)
    return {"task_id": task.id}

@app.get("/result/{task_id}")
async def get_result(task_id: str):
    result = celery_app.AsyncResult(task_id)
    if result.state == "PENDING":
        return {"status": "pending"}
    elif result.state == "SUCCESS":
        return {"status": "success", "result": result.result}
    else:
        return {"status": result.state}