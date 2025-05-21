from google.adk.agents import LlmAgent

from . import prompt

MODEL = "gemini-2.0-flash"

caption_agent = LlmAgent(
    model=MODEL,
    name="CaptionAgent",
    description="Generates a caption for a social media post",
    instruction=prompt.CAPTION_PROMPT,
    output_key="generated_caption"
)
