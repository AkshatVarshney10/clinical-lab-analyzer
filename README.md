# 🧬 Clinical Lab Results Analyzer (GenAI + MCP)

An end-to-end intelligent medical pipeline that processes lab test results, routes them by severity, and uses Explainable AI (XAI) to unpack clinical significance.

## 🚀 Architecture
This full-stack application follows a strict **Classify ➡️ Route ➡️ Explain** agent logic:
*   **Backend:** Python FastAPI with Model Context Protocol (FastMCP) support for reference database lookups.
*   **Frontend:** React, Vite, and Tailwind CSS for a modern, responsive, healthcare-grade dashboard.
*   **Dataset:** Processed and validated directly from the official Kaggle Anonymized Laboratory Test Results dataset.

## 🧠 AI Provider
**Google Gemini (gemini-2.5-flash)** was chosen for the XAI engine. It excels at complex medical reasoning, fast inference times, and strictly enforcing the structured JSON outputs required for mapping dynamic clinical explanations back to the frontend UI.

## 🛠️ Setup Instructions

**1. Start the Backend (FastAPI)**
```bash
cd backend
python -m venv venv
# Activate virtual environment (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
# Add your GEMINI_API_KEY to the .env file
python main.py
