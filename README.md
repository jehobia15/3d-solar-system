🌌 3D Solar System — WebGL / Three.js

An interactive 3D solar system built using Three.js, featuring orbiting planets, lighting effects, textures, click-to-zoom interactions, and an auto-tour mode.

🚀 Project Overview

This project simulates a mini 3D solar system where each planet orbits around the Sun at different speeds and rotates on its axis.
Users can:

Click planets to zoom in and view details

Start an automated fly-through tour

Explore using mouse controls (orbit, zoom, pan)

This project demonstrates core Computer Graphics concepts such as:
✔ 3D modeling
✔ Transformations
✔ Lighting
✔ Texture mapping
✔ Animation loops
✔ Interactivity

🖥️ Features
⭐ Planet Rendering

Each planet uses a texture-mapped sphere.

Custom orbit paths created using geometry lines.

Rotations and orbital speeds vary per planet.

🔆 Lighting System

Point light at the Sun to illuminate planets

Ambient light for soft global brightness

🖱️ Interactive Controls

Click a planet → zoom in + show name + details

Right-click → reset camera

Auto-tour button → cycles through Sun + all planets

🌍 Planet Info Panel

When a planet is selected, a UI panel displays:

Distance from Sun

Orbital period

Rotation period

Number of moons

🎥 Camera Animations

Smooth GSAP easing transitions when zooming.

🎮 Controls
| Action          | Description             |
| --------------- | ----------------------- |
| **Left Click**  | Select planet + zoom in |
| **Right Click** | Reset camera            |
| **Mouse Move**  | Orbit camera            |
| **Scroll**      | Zoom in/out             |
| **T key**       | Toggle Auto Tour        |
| **UI Button**   | Start/Stop Auto Tour    |

Technologies Used

Three.js — 3D rendering

GSAP — smooth animations

JavaScript (ES6)

HTML5 / WebGL
