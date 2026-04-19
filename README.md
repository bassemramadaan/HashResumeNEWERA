# Hash Resume 🚀

<div align="center">
  <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop" alt="Hash Resume Banner" width="100%" />
  <p><em>A modern, AI-powered resume builder designed to help users create ATS-friendly resumes and cover letters.</em></p>
</div>

## 🌟 Overview
Hash Resume is a cutting-edge, AI-powered resume builder designed to help job seekers create professional, ATS-friendly resumes and cover letters in minutes. It features real-time editing, AI-driven content generation (powered by Google Gemini), ATS scoring, and high-quality PDF/Word exports.

### 📸 Screenshots
- **Editor View:** 
  <img src="https://images.unsplash.com/photo-1626262483832-68da98af342b?w=800&auto=format&fit=crop" width="600" alt="Editor View showing real-time updates" />
- **Templates:** 
  <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop" width="600" alt="Hash Resume Templates Gallery" />
- **ATS Scoring:** 
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop" width="600" alt="ATS Scoring Dashboard" />

### 🎥 Demo Video
- [▶️ Watch the 1-Minute Walkthrough on YouTube](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

## ✨ Key Features
- **🤖 AI-Powered Content:** Generate professional summaries, experience bullet points, and tailored cover letters using Google Gemini.
- **📊 ATS Scoring:** Get real-time feedback on how well your resume matches a job description.
- **🎨 Multiple Templates:** Choose from Modern, Classic, Creative, Tech, Arabic (RTL), Engineering, Finance, and more.
- **🌍 Multi-language & RTL Support:** Full support for English, French, and Arabic (with proper Right-to-Left layout).
- **💾 Local Storage & Privacy:** Your data stays on your device until you decide to share it.
- **📄 High-Fidelity Exports:** Export to PDF or purely text-based ATS powerhouse Word document (`docx`).

## 🗺️ Roadmap
- **Q3 2026**: Resume Import (PDF/DOCX) with Auto-Cleanup algorithms.
- **Q4 2026**: Job-Tailored Resume Mode (Automatically adjust resume based on target job description).
- **Q1 2027**: Cover Letter & Resume Unified Bundle checkout.
- **Q2 2027**: Starter Templates by profession (Sales, Engineering, Healthcare).

## 📢 Release Notes
**v1.2.0 (April 2026)**
- Added direct Word (.docx) export for perfect ATS text parsing.
- Improved Editor UI with AI-chat style conversational prompts.
- Expanded Arabic translation completeness and improved RTL PDF layout.
- Added Trust & Transparency page explaining data lifecycle.

**v1.1.0**
- Integrated Google Gemini API for "Fix with AI" features.
- Released Cover Letter builder module.
- Refactored UI to use Tailwind CSS variables and Framer Motion.

## 🏗️ Architecture
The application is built using a modern Full-Stack architecture:
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Zustand (State Management).
- **Backend**: Express.js (Node.js) serving API routes and Vite middleware for development.
- **AI Integration**: `@google/genai` SDK for intelligent resume suggestions, ATS scoring, and cover letter generation.
- **Export**: `jspdf`, `html2canvas`, and `docx` for high-fidelity document generation.
- **State & Storage**: LocalStorage with `zundo` for undo/redo capabilities, and structured state slices.

## 📂 Folder Structure
```text
├── src/
│   ├── components/      # Reusable UI components (Buttons, Modals, Forms)
│   ├── pages/           # Page components (Landing, Editor, Cover Letter, Hash Hunt)
│   ├── store/           # Zustand state management (Resume, UI, Language)
│   ├── services/        # Business logic separated from UI (AI, Export, Payment, Storage)
│   ├── schemas/         # Data validation schemas (Zod)
│   ├── tests/           # Vitest test suites (Editor, Export, Payment, Storage)
│   ├── i18n/            # Internationalization (English, Arabic, French)
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Main React component
│   └── main.tsx         # React entry point
├── server.ts            # Express backend entry point
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables documentation
```

## 🔌 API Endpoints
The backend provides several API endpoints for handling secure operations:

### AI & Generation
- `POST /api/generate/summary` - Generates a professional summary based on user data.
- `POST /api/generate/experience` - Enhances work experience bullet points.
- `POST /api/generate/cover-letter` - Creates a tailored cover letter based on a job description.
- `POST /api/score/ats` - Analyzes the resume against a job description and returns an ATS score.

### Payments (Stripe)
- `POST /api/create-checkout-session` - Initializes a Stripe checkout session for premium features.
- `POST /api/webhook/stripe` - Handles Stripe webhooks for payment confirmation.

## 🚀 How to Run
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required keys (e.g., `GEMINI_API_KEY`).
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

## 🔐 Environment Variables
See `.env.example` for a full list of required environment variables.
- **Security Note**: `GEMINI_API_KEY` and payment secret keys (e.g., `STRIPE_SECRET_KEY`) must **never** be exposed to the frontend. They are injected securely in production and should only be accessed via the backend (`server.ts`).

## ☁️ Deployment Paths
The application is designed to be deployed as a containerized Cloud Run service.
- **Build**: `npm run build` compiles the React app into the `dist/` directory.
- **Production Start**: `npm start` runs `server.ts` which serves the static files from `dist/` and handles API requests.

## 🛠️ Code Quality & Checks
- **Linting & Formatting**: ESLint and Prettier are configured.
- **Pre-commit Hooks**: Husky and lint-staged ensure code quality before commits.
- **Testing**: Vitest is used for unit and integration testing. Run tests with `npm test`.

## 🛡️ Operational Security
- AI calls are routed through the backend or securely managed to prevent leaking `GEMINI_API_KEY`.
- Payment flows use secure server-side validation.
- User data is stored locally by default, ensuring privacy unless explicitly submitted to the "Hash Hunt" talent pool.
