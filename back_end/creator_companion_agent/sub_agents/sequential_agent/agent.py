from google.adk.agents import SequentialAgent

from ..music_agent import music_agent
from ..script_agent import script_agent
from ..caption_agent import caption_agent


# Full pipeline
sequential_agent = SequentialAgent(
    name="SequentialAgent",
    description="Executes a sequence of agents to generate a script and caption for a social media post.",
    sub_agents=[script_agent, caption_agent],
)