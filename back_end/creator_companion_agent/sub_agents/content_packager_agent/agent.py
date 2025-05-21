from google.adk.agents import LlmAgent

from . import prompt
MODEL = "gemini-2.0-flash"

content_packager_agent = LlmAgent(
    model=MODEL,
    name="ContentPackagerAgent",
    description="Generates a content Package for a social media post",
    instruction=prompt.CONTENT_PACKAGER_AGENT_PROMPT,
    output_key="generated_package"
)
