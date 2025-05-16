from back_end.celery_app import celery_app
from back_end.multi_tool_agent.agent import root_agent

@celery_app.task
def add(x, y):
    return x + y

@celery_app.task
def run_agent_task(new_message):
    return root_agent.run(new_message)

