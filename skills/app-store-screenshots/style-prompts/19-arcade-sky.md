---
name: arcade-sky
description: A pixel-arcade game's own sky as the deck — sky gradient with pixel clouds, a city and grass strip running across every slide as one panorama, white rounded display type with a thick ink outline and a hard ink drop shadow (the Flappy-style score look), one gold emphasis word, upright or lightly tilted phones standing on the ground, the game's mascot on the cover. Inspired by Flappy Bird, Ear Hop.
inspiration: Flappy Bird, Ear Hop, classic 8/16-bit arcade cabinets
feel: cheerful, loud, instantly "a game" — "one more try"
---

# Arcade Sky

> **READ FIRST:** [`./_QUALITY_BAR.md`](./_QUALITY_BAR.md) — universal quality rules apply to this style.

## When

Casual and arcade games whose own screens are a sky world (pixel art, side scrollers, endless
flyers). The deck must look like the game, so the background, the scenery and the mascot come
**from the game's own sprites**, never from generic illustration.

## Palette (theme `arcade-sky` in `src/lib/constants.ts`)

| Role | Hex |
|---|---|
| Sky top / bottom (gradient, the only gradient) | `#38B6E8` → `#B9EBF8` |
| Headline fill | `#FFFFFF` |
| Outline + drop shadow (ink) | `#2A2232` |
| Emphasis word, label | `#FFC93C` (gold) |

Swap in the game's own sky, ink and gold when they differ — keep the structure.

## Typography

- Rounded heavy display face: `fontId: "arial-rounded"` (Arial Rounded MT Bold; Nunito /
  Varela Round fallback), or the game's own display font imported in the toolbar.
- Headline: `headlineScale` 1.25–1.35, 2 lines, ≤ 14 characters per line on the 1320 canvas.
- Outline 11% of the font size, drop shadow 7.5% straight down, ringed to the outline width
  (`theme.text` does this: `outline`, `outlineWidth`, `dropShadow`, `dropShadowOffset`).
- Label: uppercase gold with the same outline, `labelScale` ~1.8.

## Headline emphasis

Exactly one word per headline in `*stars*` → gold. The verb or the payoff ("*Fly* the gap.",
"*Sing* to open the gate").

## Backgrounds

`backgroundImage` per slide: one panorama as wide as the whole deck — sky gradient, clouds in the
top two thirds, the city / bushes / ground strips along the bottom — cut into one image per
slide, so the clouds and the city run on across the seams (the cross-screen moment). Draw it
from the sprites with a script in the app repo; nearest-neighbour scaling only.

## Layout rhythm

- Headline block on top (3.5%–28% of the height) on every slide: the store shows them side by
  side and the eye reads the same band.
- Phone `transforms.device`: 72–74% of the canvas height, top at ~28%, its foot on the ground
  strip; tilt alternates −4° / +4°, cover and closer upright.
- Cover: the mascot sprite, ≥ 13% of the height, at the phone's top corner, overlapping the
  bezel, rotated ~10°. No other decoration: the clouds and the city are the decoration.
- Proof (best score, medal) next to last; all modes / levels as the closer.

## Copy tone

Arcade-short and playful, imperative verbs, no jargon outside the label. The label carries the
search words ("EAR TRAINING GAME", "PERFECT PITCH"). Exclamation marks only where the game
celebrates.
