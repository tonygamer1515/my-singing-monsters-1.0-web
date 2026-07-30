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
- Initial offline save/economy scaffold.
- Original Plant Island presentation scaffold.
- Four single-element monster market entries and local placement.
- Original multi-track Plant Island audio mix.
- Coin collection, bakery, goals, island menu and tutorial shell.
- Touch/mouse camera recovery.

## Next reverse-engineering tasks

1. Decode the 114 custom binary resources, starting with `island01.bin`, `monster_b.bin` and the per-world music arrangement bins.
2. Reconstruct exact skeletal/composite monster animations from the original parts and timelines.
3. Translate the original tutorial sequence, market tables, breeding combinations, build/incubation timers and levels.
4. Restore exact Plant Island grid, obstacles, decorations, structures, happiness and bed limits.
5. Implement Cold and Air islands using their bundled 1.0 art and stems.
6. Replace every retired server transaction with deterministic local equivalents.
7. Reproduce original menus from the 66 menu/template XML files.
8. Regression-test sound synchronization and save migration.
