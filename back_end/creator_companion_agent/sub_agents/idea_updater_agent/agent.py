from google.adk.agents import LlmAgent

from ...tools.api import update_idea
from . import prompt

MODEL = "gemini-2.0-flash"

idea_updater_agent = LlmAgent(
    model=MODEL,
    name="IdeaUpdaterAgent",
    description="Updates the idea in the database",
    instruction=prompt.IDEA_UPDATER_AGENT_PROMPT,
    tools=[update_idea],
)
