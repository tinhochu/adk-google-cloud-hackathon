from google.adk.agents import Agent
from . import prompt
from .sub_agents.script_agent import script_agent

# Optional: More agents like TrendHunterAgent or PostScheduler

# Full pipeline
root_agent = Agent(
    model="gemini-2.0-flash",
    name="CreatorCompanionPipeline",
    description="Executes a sequence of agents to generate a script and caption for a social media post.",
    instruction=prompt.ROOT_PROMPT,
    sub_agents=[script_agent],
)
