# FOCES Events Hub

## About
FOCES Events Hub is a responsive events listing page for the Forum of Computer Engineering Students. It highlights workshops, hackathons, seminars, competitions, and networking sessions in a clean, production-ready layout.

## Tech Stack
- React
- Vite
- Plain CSS
- Google Fonts: Space Mono and DM Sans

## Features
- Sticky dark header with responsive mobile navigation
- Hero section with a live badge and data-driven counters
- Search input and category filters powered by pure JavaScript
- Event cards with category badges, status indicators, and seat counts
- Responsive grid layout for desktop, tablet, and mobile
- Lightweight static data source with no backend dependency

## Getting Started
1. Install dependencies:
	```bash
	npm install
	```
2. Start the development server:
	```bash
	npm run dev
	```
3. Build for production:
	```bash
	npm run build
	```

## Design Decisions
- Vite was chosen for fast development and small production builds.
- A component-based architecture keeps the page reusable and easy to extend.
- Static event data lives in a single file so the demo works without a backend.
- CSS custom properties provide a consistent theme and simplify visual tuning.
- No external UI library was added to keep the bundle small and the layout fully custom.

## Development Notes

This project was developed primarily through an AI-assisted ("vibe coding") workflow and was implemented in a small number of iterative development phases.

The current release focuses on delivering the core functionality and user experience of the platform. Planned features such as cloud database integration and advanced backend services have been identified for future development.

Due to project submission timelines and development resource limitations, certain planned enhancements could not be completed within the current release cycle. As a result, the application remains in an active development stage and will continue to evolve through future updates and feature additions.
