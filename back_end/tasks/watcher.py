import os
from pymongo import MongoClient
from back_end.multi_tool_agent import creator_companion
from bson.objectid import ObjectId

# Load environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Set up MongoDB client
client = MongoClient(MONGO_URI)
db = client["adkhackathon"]
ideas_collection = db["ideas"]

def process_idea(task_id):
    print(f"⚡ Processing idea: {task_id}")

    # Fetch the document
    idea = ideas_collection.find_one({"_id": ObjectId(task_id)})
    if not idea:
        print("❌ Idea not found.")
        return

    context = idea.get("context", {})
    
    # Set to processing
    ideas_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": "processing"}}
    )

    try:
        # Run multi-agent pipeline (ADK SequentialAgent)
        result = creator_companion_agent.create_session(``)

        # Save results
        ideas_collection.update_one(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "completed",
                    "results": result
                }
            }
        )
        print("✅ Task completed.")
    except Exception as e:
        print(f"❌ Error while running agent: {e}")
        ideas_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": "error", "error_message": str(e)}}
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

# Session and Runner
# session_service = InMemorySessionService()
# session = session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
# runner = Runner(agent=stock_price_agent, app_name=APP_NAME, session_service=session_service)