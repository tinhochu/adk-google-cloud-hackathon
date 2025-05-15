from celery import Celery
import os

# Set default values or get from environment variables
REDIS_URL = os.getenv("REDIS_URL")

celery_app = Celery(
    "creatorCompanionWorker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["back_end.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
) 