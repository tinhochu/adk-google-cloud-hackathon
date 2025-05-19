import os
from pymongo import MongoClient
from bson.objectid import ObjectId

# Load environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Set up MongoDB client
client = MongoClient(MONGO_URI)
db = client["adkhackathon"]
ideas_collection = db["ideas"]

def process_idea(task_id):
    print(f"⚡ Processing idea: {task_id}")
    # Trigger your agent here:
    # script_agent.delay(task_id)
    ideas_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "processing"}}
    )

def process_existing_queued_ideas():
    print("🔁 Checking for existing queued ideas...")
    queued_tasks = ideas_collection.find({"status": "pending"})
    for task in queued_tasks:
        task_id = str(task["_id"])
        process_idea(task_id)

def watch_for_new_ideas():
    print("👀 Watching for new ideas...")
    try:
        with ideas_collection.watch([{"$match": {"operationType": "insert"}}]) as stream:
            for change in stream:
                task_id = str(change["fullDocument"]["_id"])
                process_idea(task_id)
    except Exception as e:
        print(f"❌ Error in watcher: {e}")

if __name__ == "__main__":
    process_existing_queued_ideas()  # <--- process old queued tasks
    watch_for_new_ideas()            # <--- listen for new ones
