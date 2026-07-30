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

## Playable first milestone

- Original 1.0 title artwork and icon
- Offline local profile/save
- Plant Island camera pan and zoom
- Original grass, sky, castle, nursery and breeding art
- Initial Potbelly, Noggin, Toe Jammer and Mammott market/placement loop
- Original synchronized Plant Island bass and monster OGG stems
- Monster coin generation/collection
- Bakery, breeding-development, goals and island panels
- Five-page tutorial
- Touch, mouse, pinch and wheel controls

This is the first development milestone, not yet a complete native-mechanics reproduction.

## Run locally

```bash
python3 -m http.server 8080
```

Open http://localhost:8080.
