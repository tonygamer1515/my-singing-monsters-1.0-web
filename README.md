# My Singing Monsters 1.0 — Browser Preservation Port

An offline browser reconstruction of Big Blue Bubble's original 2012 **My Singing Monsters 1.0** iOS client.

- Play: https://tonygamer1515.github.io/my-singing-monsters-1.0-web/
- Repository: https://github.com/tonygamer1515/my-singing-monsters-1.0-web

## Exact source

- Internet Archive: https://archive.org/details/1.4.3_202310
- Source file: `1.0.ipa`
- Local archive: `My-Singing-Monsters-1.0.0.ipa`
- Size: 14,010,790 bytes
- SHA-1: `2ef00e986f6dfe551bc167bf87784ed3893dc471`
- Bundle: `com.bigbluebubble.My-Singing-Monsters`
- Version/build: `1.0` / `1.0`
- Minimum iOS: 4.0
- ARMv7, iPhone/iPad landscape
- Resource timestamps: 10 August 2012
- Mach-O encryption status: `cryptid = 0` (already decrypted)

Version 1.0.0 was the iOS launch line; Android began later, so an Android `1.0.0` APK does not exist. The recovered `1.0.ipa` is the correct source.

## Recovery inventory

- 144 original PNG files
- 72 OGG monster music stems
- Three MIDI world arrangements
- 27 WAV effects and five MP3 tracks
- 66 readable XML menu/template files
- 85 readable TexturePacker XML atlases, converted to a registry of 1,193 named sprites
- 114 custom binary world, animation and object resources
- Plant, Cold and Air island art/audio
- Original monsters, structures, decorations, HUD, store, goals, tutorial and login assets

The retired native app used SmartFox/SFS2X servers for accounts and economy state. The web port replaces that dependency with an offline local save while preserving original client assets and mechanics.

## Current playable build

- Original 1.0 title artwork and offline local profile/save
- The real 45-layer animated Plant, Cold and Air Island bodies decoded from the IPA
- Exact 39×39 isometric surface built from all 950 authored tiles (no synthetic ellipse)
- All 107 recoverable revision-1 AEAnim resources converted from native BIN to compact browser data
- All 27 natural monsters used across the first three islands rendered from their real parented sprite layers and interpolated keyframes
- Fifteen valid monsters per island, including Entbrat, Deedge and Riff
- Market cards themselves render the real animated `Store` compositions instead of egg/spore placeholders
- Original island-specific animated monster clips and OGG stems on a shared Web Audio clock
- Animation pauses during stem decoding, preventing delayed/desynchronized starts
- Correct TexturePacker dimensions for 211 rotated sprites prevent clipped bodies, limbs, mouths and island pieces
- Launch-era sprite-cycle expansion now follows the native forward-only numbered-frame rule, eliminating backward mouth morphing
- Island monsters render at a smaller 55% stage scale with responsive world fit
- Scups/Riff launch concept images are edge-masked to transparency instead of rendering white rectangles
- Isometric placement snaps to free grid cells, excludes structures, and prevents monsters stacking on each other
- Monsters and structures are depth-sorted by their island Y position; always-on labels were removed
- Monster information panels use the real animated Store composition rather than an egg icon
- Responsive island auto-fit prevents cropped oversized worlds while preserving manual pan/zoom
- A visible title-screen loader prevents entering a blank canvas before native animation data is ready
- Only the active island's 15 monsters and atlases load initially; Cold/Air assets load on demand
- Original animated nursery, breeding mountain and bakery structures
- Egg purchase, nursery timer/hurry, hatch/placement, breeding combinations and breeding timers
- Monster coin generation/collection, feeding, levels, happiness state, move, mute and sell
- Plant, Cold and Air Island selection with original island buttons, skies, terrain and music
- Bakery, goals, tutorial, touch/mouse pan, pinch and wheel zoom

The remaining work is exact server-era economy tables, the complete original menu event scripts, advanced decoration/happiness interactions and final timing refinements—not replacement graphics.

## Run locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080.
