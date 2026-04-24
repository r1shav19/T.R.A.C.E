# T.R.A.C.E.

T.R.A.C.E. is a React + Vite crisis-response prototype for high-risk missing-person and domestic-violence scenarios. The app simulates an emergency workflow from SOS activation through command-center coordination, responder guidance, evidence capture, silent cross-match checks, and post-incident intelligence.

## What the app includes

- `SOS` trigger flow with dependent selection, safety hold, and staged activation logs
- `Command` center with live map simulation, responder coordination, evidence vault, and cross-match dashboard
- `Profiles` management view for protected dependants and risk factors
- `Innovation` page showcasing the next product layer and upgraded Google-based architecture
- Multi-language website switcher in the navbar
- Gemini-ready field briefing flow with simulated fallback when no API key is configured

## New innovation layers

The `Innovation` tab now presents six product directions:

1. Gemini-powered victim profiling at trigger
2. Crowd-sourced vision network
3. Threat vector detection
4. Silent hospital cross-match
5. Post-crisis trauma handoff
6. Attacker proximity alert

## Upgraded Google stack

- Behavioral risk profiling: `Gemini Pro`
- Threat vector and route prediction: `Vertex AI + Maps Routes API`
- Hospital and shelter silent cross-match: `BigQuery + Pub/Sub`
- Crowd-sourced scanner network: `Firebase + Maps Nearby Search`
- Aggressor proximity modeling: `Maps Distance Matrix API`
- Trauma handoff automation: `Gemini + Google Forms API`

## Language switcher

The top-right language switcher uses Google Translate page translation so the interface can be viewed in multiple languages without manually duplicating every UI string.

Currently exposed languages:

- English
- Hindi
- Bengali
- Tamil
- Telugu
- Spanish
- French
- Arabic
- Portuguese
- Tagalog

The selected language is persisted in local storage.

## Gemini setup

The cross-match briefing panel is wired for Gemini. To enable live responses, create a `.env` file in `C:\T.R.A.C.E\trace-app` with:

```env
VITE_GEMINI_API_KEY=your_google_ai_api_key
```

If the key is missing or the request fails, the app falls back to a simulated briefing so the demo still works.

## Local development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Demo flow

1. Open `SOS` and choose a protected profile.
2. Hold the SOS button to trigger the incident.
3. Move to `Command` to show map activity, responders, evidence, and cross-match scanning.
4. Open `Cross-Match` and run the Gemini field briefing.
5. Open `Innovation` to present the future roadmap and Google tech stack.
6. Use the language switcher to show multilingual accessibility.

## Stack

- React 19
- Vite 8
- Inline state-driven simulation UI
- Google Translate widget for multilingual page translation
- Gemini API integration via `generateContent`

## Notes

- This repo currently uses a single large `src/App.jsx` file for the core demo experience.
- The UI is optimized for presentations and demos rather than backend-connected production workflows.
- The build was verified successfully with `npm run build`.
