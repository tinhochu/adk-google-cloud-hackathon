"""Defines tools for tiktok"""

from google.adk.tools import ToolContext
import requests
import os

def get_tiktok_music_trending_list(tool_context: ToolContext):
    """Get the trending music list on tiktok"""
    url = "https://tiktok-api23.p.rapidapi.com/api/trending/song"
    querystring = {
        "page": "1",
        "limit": "20",
        "period": "7",
        "rank_type": "popular",
        "country": "US"
    }
    api_key = os.getenv("RAPID_API_KEY")
    if not api_key:
        print("Error: RAPID_API_KEY environment variable not set.")
        return None
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "tiktok-api23.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        response.raise_for_status()
        data = response.json()
        sound_list = data.get('data', {}).get('sound_list', [])
        # Extract only the required fields
        result = [
            {
                'author': item.get('author'),
                'country_code': item.get('country_code'),
                'link': item.get('link'),
                'title': item.get('title'),
                'cover': item.get('cover')
            }
            for item in sound_list
        ]
        return result
    except requests.RequestException as e:
        print(f"Error fetching TikTok trending music: {e}")
        return None
    