# Alton OS — Personal Portfolio

A personal portfolio website styled as a desktop OS experience, with draggable windows, ambient rain audio, animated rain canvas, and Spotify embeds. Built from scratch with vanilla HTML, CSS, and JavaScript — no frameworks or build tools required.

**Live site:** [zenflamex.github.io](https://zenflamex.github.io)

---

## Features

- **Window manager** — openable, closeable, draggable, and focusable windows for each section (About, Projects, Skills, Links, Contact, Music)
- **Animated rain canvas** — procedurally drawn rainfall rendered on a full-screen canvas
- **Ambient rain audio** — looping background rain sound with a mute/unmute toggle
- **Project lightbox** — expandable project cards with image galleries, drag-to-scroll, and a fullscreen image viewer with keyboard and swipe navigation
- **Spotify embeds** — collapsible music list with embedded Spotify players
- **Responsive mobile layout** — windows become bottom sheets on small screens, with a backdrop dismiss and a mobile notice on first visit
- **Sound effects** — subtle click SFX on window open/close interactions
- **Social dock** — quick links to GitHub, LinkedIn, and resume

---

## Project Structure

```
/
├── index.html          # Main HTML — all window content and DOM structure
├── styles.css          # All styling, animations, and responsive layout
├── script.js           # Window manager, rain, audio, lightbox, and project data
├── v1.html             # Previous version of the portfolio (linked from Contact)
├── images/
│   ├── headshot.jpg
│   ├── Avatar.jpg
│   ├── resume.pdf
│   └── ...             # Project screenshots
└── sound/
    ├── rain-bg.mp3     # Looping ambient rain audio
    └── click.mp3       # UI click sound effect
```

---

## Customisation

### Adding or editing projects
Projects are defined in the `PROJECTS` array at the top of `script.js`. Each entry supports:

```js
{
  name: 'Project Name',
  year: '2025',
  tags: ['React', 'Node'],
  shortDesc: 'One-line description shown on the card.',
  fullDesc: 'Full description shown in the lightbox.',
  thumbs: ['images/screenshot1.png', 'images/screenshot2.png'],
  github: 'https://github.com/...',   // optional
  live: 'https://...',                // optional
  liveLabel: 'Live Demo',             // optional, defaults to "Live Site"
}
```

### Adding music
Music entries are hardcoded in `index.html` inside `#win-music`. Copy an existing `.music-item` block and replace the Spotify embed `src` URL and the `aria-label` on the play button.

### Window sizes
Default window dimensions are set in the `WIN_SIZES` object in `script.js`:

```js
const WIN_SIZES = {
  about:    { w: 680, h: 560, fixedH: true },
  projects: { w: 720, h: 580, fixedH: true, autoH: true },
  // ...
};
```

---

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- Google Fonts (Playfair Display, Lora)
- Spotify Embed API
- Web Audio API (`HTMLAudioElement`)
- Canvas API (rain animation)

---

## Notes

- The `v1.html` file is the original portfolio from ~2 years prior, preserved and linked as a fun historical reference.
- The site uses Cloudflare email obfuscation on the deployed version, which replaces `mailto:` links with encoded equivalents.