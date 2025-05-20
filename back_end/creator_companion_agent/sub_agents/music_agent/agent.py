from google.adk.agents import LlmAgent

from . import prompt
from ...tools.tiktok import get_tiktok_music_trending_list
MODEL = "gemini-2.0-flash"

music_agent = LlmAgent(
    model=MODEL,
    name="MusicAgent",
    description="Generates a music for a social media post",
    instruction=prompt.MUSIC_AGENT_PROMPT,
    tools=[get_tiktok_music_trending_list],
    output_key="music_trending_list"
)
