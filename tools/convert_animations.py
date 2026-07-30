#!/usr/bin/env python3
"""Decode the launch-era MSM 1.0 AEAnim binary resources.

The ARM client reads a little-endian dump of its original AE animation data:
version/sheet header, animation records, parented layers, then fixed 0x68-byte
keyframe blocks followed by optional sprite/tint/context changes.
"""
from pathlib import Path
import argparse
import json
import struct


class Reader:
    def __init__(self, path: Path):
        self.data = path.read_bytes()
        self.pos = 0

    def take(self, size):
        if self.pos + size > len(self.data):
            raise EOFError(f'Unexpected end at {self.pos:#x}')
        value = self.data[self.pos:self.pos + size]
        self.pos += size
        return value

    def u32(self):
        return struct.unpack('<I', self.take(4))[0]

    def f32(self):
        return struct.unpack('<f', self.take(4))[0]

    def string(self):
        length = self.u32()
        if length > 0x10000:
            raise ValueError(f'Invalid string length {length}')
        raw = self.take(length)
        self.pos += (-length) % 4
        return raw.rstrip(b'\0').decode('ascii', errors='replace')

    def aligned_string(self):
        length = self.u32()
        if length > 0x10000:
            raise ValueError(f'Invalid aligned string length {length}')
        raw = self.take(length)
        self.pos += (-length) % 4
        return raw.rstrip(b'\0').decode('ascii', errors='replace')


def immediate(block, offset):
    value = struct.unpack_from('<I', block, offset)[0] & 0xff
    return value if value < 128 else value - 256


def number(block, offset):
    return struct.unpack_from('<f', block, offset)[0]


def parse(path: Path):
    reader = Reader(path)
    version = reader.u32()
    if version != 1:
        raise ValueError(f'Not a revision-1 AEAnim file (version {version})')
    sheet = reader.string()
    reader.u32(); reader.u32()
    animation_count = reader.u32()
    if animation_count > 500:
        raise ValueError(f'Implausible animation count {animation_count}')
    animations = []
    for _ in range(animation_count):
        name = reader.string()
        packed = reader.u32()
        width, height = packed & 0xffff, packed >> 16
        loop_offset = reader.f32()
        centered = reader.u32()
        layer_count = reader.u32()
        if layer_count > 1000:
            raise ValueError(f'Implausible layer count {layer_count}')
        layers = []
        for _ in range(layer_count):
            layer_name = reader.string()
            parent_ref = reader.string()
            parent = -1
            if ':' in parent_ref:
                try: parent = int(parent_ref.split(':', 1)[0])
                except ValueError: pass
            layer_id, layer_type, source_index, blend = struct.unpack('<4I', reader.take(16))
            frame_count = reader.u32()
            if frame_count > 100000:
                raise ValueError(f'Implausible frame count {frame_count}')
            frames = []
            current_sprite = ''
            anchor = [0.0, 0.0]
            for frame_index in range(frame_count):
                block = reader.take(0x68)
                reader.u32()  # post-frame flags
                sprite_change = reader.aligned_string()
                tint = [reader.f32(), reader.f32(), reader.f32()]
                context = reader.aligned_string()
                if sprite_change:
                    current_sprite = sprite_change
                if frame_index == 0:
                    anchor = [number(block, 0x1c), number(block, 0x20)]
                frames.append([
                    number(block, 0x00),
                    immediate(block, 0x24), number(block, 0x28), number(block, 0x2c),
                    immediate(block, 0x30), number(block, 0x34), number(block, 0x38),
                    immediate(block, 0x3c), number(block, 0x40),
                    immediate(block, 0x44), number(block, 0x48),
                    current_sprite, tint, context,
                ])
            layers.append({'n': layer_name, 'p': parent, 'id': layer_id, 't': layer_type,
                           'src': source_index, 'b': blend if blend < 8 else 0,
                           'a': anchor, 'f': frames})
        animations.append({'n': name, 'w': width, 'h': height, 'loop': loop_offset,
                           'c': centered, 'l': layers})
    return {'sheet': sheet, 'animations': animations, 'bytesRead': reader.pos,
            'fileSize': len(reader.data)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    result = parse(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, separators=(',', ':')))
    print(f'{args.input.name}: {len(result["animations"])} animations, '
          f'{result["bytesRead"]}/{result["fileSize"]} bytes')


if __name__ == '__main__':
    main()
