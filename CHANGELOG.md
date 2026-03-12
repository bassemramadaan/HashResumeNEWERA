# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-12
### Added
- **Hash Hunt Page**: A new page for users to submit their resumes to the talent pool.
- **Cover Letter Builder**: AI-powered cover letter generation.
- **ATS Scoring**: Real-time scoring and keyword analysis.
- **Export Options**: High-quality PDF and editable Word document exports.
- **Multi-language Support**: English, Arabic, and French translations.
- **Dark Mode**: Full dark mode support across all pages.
- **Undo/Redo**: State management with `zundo` for resume editing.
- **Comprehensive Testing**: Vitest test suites for Editor, Export, Payment, and Storage.
- **Separation of Concerns**: Business logic extracted into dedicated services (`ai.service.ts`, `export.service.ts`, `payment.service.ts`, `storage.service.ts`).
- **Data Validation**: Zod schemas for resume data validation.
- **Code Quality Tools**: ESLint, Prettier, Husky, and lint-staged for pre-commit checks.

### Changed
- **Landing Page**: Updated design and copy for better conversion.
- **Hash Hunt Page**: Realigned spaces and moved the Benefits section to the top.
- **Pricing Section**: Removed the "Free re-downloads" feature from the pricing list.
- **README.md**: Replaced with a comprehensive product document.
- **Environment Variables**: Documented `.env.example` with clear instructions and security notes.

### Fixed
- **Server Startup**: Fixed an issue where the server would crash due to missing utility files (`jobs.ts`, `rateLimit.ts`).
- **Responsive Design**: Improved mobile layout and touch targets.
