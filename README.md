# 🎤 AI Mock Interviews

A full-stack web application for practicing **real-time mock interviews with AI**.  
It supports **free browser-based voice interviews** and an option to upgrade to **Gemini Live (paid, low-latency WebRTC)**.

---

## 🚀 Features

- 🔑 **Authentication** with Laravel Sanctum (Register/Login/Logout).
- 🗣 **Two voice modes**:
  - **Browser Voice (Free)** — Uses Web Speech API (SpeechRecognition + SpeechSynthesis).
  - **Gemini Live (Paid)** — WebRTC-based AI interviewer with low latency.
- 🎯 **Customizable interviews**:
  - Role/track, difficulty, experience years.
  - Tech stack, company type, focus areas, language.
  - Adjustable interview length.
- 📊 **Results Dashboard**:
  - Overall score (auto-calculated).
  - Rubric breakdown (communication, depth, structure, etc.).
- 📜 **History page** to review past interviews and transcripts.
- 🔒 **Hidden prompt builder** — AI sees structured instructions, not user input directly.

---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- React-Bootstrap (UI)
- Axios (API calls)
- Web Speech API (for Browser Voice mode)

### Backend
- Laravel 12 (API + auth + business logic)
- Sanctum (token-based authentication)
- MySQL (persistent storage)
- Custom `PromptBuilder` service

### AI Engines
- **OpenAI GPT-4o-mini** (default, free tier limited).
- **Google Gemini** (optional, requires API key).
- Gemini Live (WebRTC) — ready for paid upgrade.

---

## 📂 Project Structure

