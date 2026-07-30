# Porting status

## Confirmed source and architecture

- Exact 1.0 IPA recovered and checksum verified.
- Native ARMv7 Mach-O, already decrypted (`cryptid 0`).
- OpenGL ES renderer, OpenAL audio, libxml2, SQLite and SmartFox/SFS2X networking.
- No Unity or Cocos runtime.
- Client resources are mostly plain PNG, OGG, WAV and XML.
- Custom `.bin` files contain sprite-composition, animation, island and object data.

## Completed

- Preservation project created separately from the paused Hatchery and Thomas projects.
- Full original `data/` directory preserved under `assets/original/`.
- 85 TexturePacker XML atlases parsed into 1,193 browser sprite records.
- Offline version-3 save/economy migration.
- Independent revision-1 AEAnim BIN decoder saved in `tools/convert_animations.py`.
- 107 animation resources fully decoded; all files consume exactly their native byte length.
- Browser affine animation runtime with keyframe interpolation, anchors, negative scale/mirroring and parent transforms.
- Real 45-layer island bodies for Plant, Cold and Air Islands.
- Shared 39×39 native grid decoded into all 950 terrain placements and all three 18-tile atlases.
- All 27 natural monster species needed across the first three islands, with real animated body parts—not egg placeholders.
- All market cards render each monster's original animated `Store` composition; eggs appear only during the intentional Nursery phase.
- Fifteen valid species and original first vocal stem on each island.
- Original animated nursery, breeding mountain and bakery.
- Market eggs, nursery incubation/hurry/hatch placement, breeding combinations/timers.
- Monster feeding/levels, coin collection, move, mute and sell.
- Original island menu buttons, skies, terrain and per-island music selection.
- Touch/mouse camera recovery and tutorial.

## Next reverse-engineering tasks

1. Decode the remaining non-animation manifests: per-world buddy/audio maps, market data, grid occupancy and server payload structures.
2. Reproduce the exact MIDI/buddy scheduling for monsters with two or three alternating vocal clips.
3. Translate every original tutorial and menu event from the 66 menu/template XML files.
4. Restore all authored obstacles, decorations, happiness likes, castle bed limits and structure upgrade levels.
5. Replace every retired server transaction with deterministic local equivalents matching the launch economy.
6. Add exact bake recipes, feeding quantities, breeding probabilities and all goal rewards.
7. Refine depth sorting between island tiles, monsters, structures and animated island layers.
8. Regression-test all 45 island/monster combinations, sound synchronization and save migration.
