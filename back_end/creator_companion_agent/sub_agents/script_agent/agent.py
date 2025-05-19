from google.adk import Agent

from . import prompt

MODEL = "gemini-2.0-flash" 

script_agent = Agent(
    model=MODEL,
    name="script_agent",
    instruction=prompt.SCRIPT_PROMPT,
    output_key="script_output",
)