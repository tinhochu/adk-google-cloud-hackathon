from google.adk.agents import ParallelAgent
from ..music_trend_agent import music_trend_agent
from ..preproduction_agent import preproduction_agent

# Parallel pipeline
preprod_parallel_agent = ParallelAgent(
    name="PreproductionParallelAgent",
    description="Executes a parallel pipeline of agents to go find the music, script, caption and content packager",
    sub_agents=[music_trend_agent, preproduction_agent],
)