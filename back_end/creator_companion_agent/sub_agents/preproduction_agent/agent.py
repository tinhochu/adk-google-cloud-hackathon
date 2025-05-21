from google.adk.agents import ParallelAgent

from ..script_agent import script_agent
from ..caption_agent import caption_agent

# Full pipeline
preproduction_agent = ParallelAgent(
    name="PreproductionAgent",
    description="Executes a sequence of agents to generate a script and caption for a social media post.",
    sub_agents=[script_agent, caption_agent],
)