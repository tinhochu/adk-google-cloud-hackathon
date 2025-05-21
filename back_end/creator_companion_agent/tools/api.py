"""Defines API tools"""

from google.adk.tools import ToolContext
import requests

def update_idea(tool_context: ToolContext):
    try:
        """Update the Idea in the Database"""
        print("HELLO_DOLLY")
        url = "http://localhost:3000/api/ideas"

        response = requests.put(url, json=tool_context.state['generated_package'])

        return response.json()
    except Exception as e:
        print(f"Error updating idea: {e}")
        return None