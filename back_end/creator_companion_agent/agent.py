from google.adk.agents import LlmAgent
from . import prompt
from .sub_agents.sequential_agent import sequential_agent

creator_companion_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="CreatorCompanionAgent",
    instruction=prompt.ROOT_PROMPT,
    sub_agents=[sequential_agent],
    output_key="content_package",
)

root_agent = creator_companion_agent