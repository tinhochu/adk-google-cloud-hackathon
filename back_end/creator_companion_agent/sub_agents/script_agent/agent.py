from google.adk.agents import LlmAgent

from . import prompt

MODEL = "gemini-2.0-flash" 

script_agent = LlmAgent(
    model=MODEL,
    name="ScriptAgent",
    description="Generates a 60-second script for a social media post",
    instruction=prompt.SCRIPT_PROMPT,
    output_key="generated_script",
)