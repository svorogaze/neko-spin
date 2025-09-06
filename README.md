# NekoSpin

NekoSpin is a small Next.js client app that "spins a wheel" to pick a random website from neocities, nekoweb, geocities. It uses local JSON lists stored in `public/` and a simple UI to pick sources, spin, and open the chosen site.

## Quick links
- Entry / UI: [`Home`](app/page.js) — see [app/page.js](app/page.js)  
- Spinner component: [`SpinningWheelComponent`](app/page.js) — see [app/page.js](app/page.js)  
- Button: [`SpinButton`](app/page.js) — see [app/page.js](app/page.js)  
- Source checkbox: [`Checkbox`](app/page.js) — see [app/page.js](app/page.js)  
- Source loader: [`LoadFromSource`](app/page.js) — see [app/page.js](app/page.js)  
- Layout & global styles: [app/layout.js](app/layout.js), [app/globals.css](app/globals.css)  
- Source data: [public/neocities.json](public/neocities.json), [public/nekoweb.json](public/nekoweb.json), [public/geocities.json](public/geocities.json)  
- Sound effect: [public/lets-go-gambling.mp3](public/lets-go-gambling.mp3)  
- Project config: [package.json](package.json)

## How it works (high level)
1. User enables one or more sources with the checkboxes (handled by [`Checkbox`](app/page.js)).
2. The app loads the selected source JSON from `public/` via [`LoadFromSource`](app/page.js) and merges/shuffles entries.
3. Press "Spin the wheel" (`[`SpinButton`](app/page.js)`) to start a short animated spin managed by [`SpinningWheelComponent`](app/page.js).
4. When the spin finishes, a popup shows the selected URL and lets you open it in a new tab.

Source JSON files are plain arrays of strings (see [public/nekoweb.json](public/nekoweb.json) for an example excerpt).

## Run locally
1. Install deps:
```sh
npm install
```
2. Run dev server:
```sh
npm run dev
```
