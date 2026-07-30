#!/usr/bin/env python3
"""Convert MSM 1.0 TexturePacker XML metadata into one browser registry."""
from pathlib import Path
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / 'assets' / 'original'
registry = {'atlases': {}, 'sprites': {}}

for path in sorted((ORIGINAL / 'xml_resources').glob('*.xml')):
    try:
        root = ET.parse(path).getroot()
    except ET.ParseError:
        continue
    if root.tag != 'TextureAtlas':
        continue
    image = root.attrib.get('imagePath')
    if not image:
        continue
    registry['atlases'][path.stem] = f'assets/original/{image}'
    for node in root.findall('sprite'):
        data = node.attrib
        name = data['n']
        rotated = data.get('r') == 'y'
        default_original_w = int(data['h']) if rotated else int(data['w'])
        default_original_h = int(data['w']) if rotated else int(data['h'])
        registry['sprites'][name] = {
            'atlas': path.stem,
            'x': int(data['x']), 'y': int(data['y']),
            'w': int(data['w']), 'h': int(data['h']),
            'offsetX': int(data.get('oX', 0)), 'offsetY': int(data.get('oY', 0)),
            'originalW': int(data.get('oW', default_original_w)),
            'originalH': int(data.get('oH', default_original_h)),
            'rotated': rotated,
        }

out = ROOT / 'assets' / 'data' / 'sprites.json'
out.write_text(json.dumps(registry, separators=(',', ':')))
print(f'{len(registry["atlases"])} atlases, {len(registry["sprites"])} sprites')
