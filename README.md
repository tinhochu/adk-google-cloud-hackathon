# Agent Development Kit Hackathon with Google Cloud 2025

## Author

![Tin Ho Chu](https://github.com/tinhochu.png?size=50)

**Tin Ho Chu**  
[![GitHub](https://img.shields.io/badge/GitHub-@tinhochu-181717?logo=github)](https://github.com/tinhochu)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Tin_Ho_Chu-blue?logo=linkedIn)](https://linkedin.com/in/tinhochu)  
[![Twitter](https://img.shields.io/badge/@tinhochu-000000?logo=x)](https://x.com/tinhochu)

---

## 🎥 Demo Video

[Add your demo video link here]

---

## 🚀 Project Overview

I'm building **ClipLab** — a full-stack AI studio crew for content creators, powered by Google’s Agent Development Kit (ADK). This project helps YouTubers, TikTokers, and Instagram creators go from content idea to ready-to-post video scripts, captions, and trending sounds in under a minute.

Burnout is real for digital creators. ClipLab solves this by automating the **pre-production process** with a crew of specialized AI agents that collaborate behind the scenes.

All it takes is a 3-sentence content brief. ClipLab handles the rest — scripting, captioning, and trend hunting — giving creators more time to focus on recording and growing their audience.

---

## 🧠 Features & Functionality

- **One-line idea input** → full content pack (script, caption, trending music)
- AI agents built with ADK handle the heavy lifting:
  - 🎬 `script_agent`: Writes a 60s platform-native script
  - 💬 `caption_agent`: Generates caption + hashtags
  - 🎵 `music_agent`: Pulls trending TikTok sounds via tool
  - 📦 `content_packager_agent`: Packages it all into a ready-to-use JSON response
- Optional expansion: scheduling, analytics, shot planning

---

## 🛠️ Technology Stack

### Frontend

- [Next.js](https://nextjs.org)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)

### Backend

- [FastAPI](https://fastapi.tiangolo.com/)
- [Celery](https://docs.celeryq.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [Google ADK (Agent Development Kit)](https://github.com/google/agent-development-kit)

### APIs & AI Models

- [Google Gemini](https://developers.google.com/gemini)
- [Google Custom Search API](https://developers.google.com/custom-search)
- TikTok Music API (custom wrapper)

---

## 📡 Installation & Setup

1. Clone the repo
2. Set up your `.env` file (refer to `.env.example`)
3. (Optional) Start the frontend: `npm run dev`

---

## 🧠 Inspiration

Creators are overwhelmed by the daily pressure to ideate, write, and stay on-trend. I wanted to build an AI-powered team that could take care of everything before hitting record.

---

## ⚙️ How We Built It

- Multi-agent architecture using Google ADK primitives
- Each agent runs in a Celery worker to simulate async team collaboration
- Tools like Google Search and TikTok APIs power external data
- FastAPI for routing and testing pipelines
- Frontend interface built in Next.js with Tailwind and Shadcn UI

---

## ❗ Challenges I Ran Into

- Designing clear, prompt-safe interactions between agents
- Handling voice/audio uploads for transcription and idea extraction
- Ensuring agent outputs chained correctly without human input
- Making TikTok data accessible and usable through a tool interface

---

## ✅ Accomplishments That I'm Proud Of

- Fully working multi-agent pipeline using ADK
- Hands-free content pack generation from a single user prompt
- Integration of AI tools, scripting models, and live trend data

---

## 📚 What I Learned

- How to architect multi-agent workflows using ADK
- Prompt engineering for sequential creativity (script → caption → music)
- Real-world deployment challenges with Celery and FastAPI
- Designing AI tools that empower creators rather than replace them

---

## 🔮 What's Next for ClipLab

- Add `post_scheduler_agent` to auto-publish via Buffer/Meta/YouTube Studio
- Add `shot_planner_agent` to break scripts into visual scenes
- Voice input → transcription → idea pipeline
- Spanish language support for LATAM creators
- Build out user dashboards for content history and analytics

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
