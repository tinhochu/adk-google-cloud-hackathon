import os
from pymongo import MongoClient
from bson.objectid import ObjectId


# Load environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Set up MongoDB client
client = MongoClient(MONGO_URI)
db = client["adkhackathon"]
ideas_collection = db["ideas"]

def process_new_idea(task_id):
    print(f"⚡ New idea detected: {task_id}")
    # If you have a script_agent task, trigger it here
    # script_agent.delay(task_id)
    ideas_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "processing"}}
    )

def watch_for_new_ideas():
    print("👀 Watching for new Ideas...")
    try:
        with ideas_collection.watch([{"$match": {"operationType": "insert"}}]) as stream:
            for change in stream:
                task_id = str(change["fullDocument"]["_id"])
                process_new_idea(task_id)
    except Exception as e:
        print(f"Error in watcher: {e}")

if __name__ == "__main__":
    watch_for_new_ideas()
