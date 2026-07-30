#!/usr/bin/env python3
"""Decode the MSM 1.0 binary grass atlas and 39×39 island tile grid."""
from pathlib import Path
import json
import struct

ROOT=Path(__file__).resolve().parents[1]
BIN=ROOT/'assets/original/xml_bin'

class Reader:
    def __init__(self,path):self.data=Path(path).read_bytes();self.pos=0
    def take(self,n):v=self.data[self.pos:self.pos+n];self.pos+=n;return v
    def u32(self):return struct.unpack('<I',self.take(4))[0]
    def u16(self):return struct.unpack('<H',self.take(2))[0]
    def i16(self):return struct.unpack('<h',self.take(2))[0]
    def f32(self):return struct.unpack('<f',self.take(4))[0]
    def string(self):
        n=self.u32();raw=self.take(n);self.pos+=(-n)%4
        return raw.rstrip(b'\0').decode('ascii')

def atlas(path):
    r=Reader(path);image=r.string()+'.png';count=r.u32();sprites={}
    for _ in range(count):
        name=r.string();xy=r.u32();wh=r.u32();sprites[name]=[xy&0xffff,xy>>16,wh&0xffff,wh>>16]
    return {'image':'assets/original/'+image,'sprites':sprites}

def grid(path):
    r=Reader(path);columns=r.u16();rows=r.u16();tw=r.u16();th=r.u16();ox=r.i16();oy=r.i16();bw=r.u16();bh=r.u16()
    for _ in range(6):r.u16()
    count=r.u32();entries=[]
    for _ in range(count):
        name=r.string();packed=r.u32();height=r.f32();flags=r.u32();entries.append([name,packed&0xffff,packed>>16,height,flags])
    return {'columns':columns,'rows':rows,'tileWidth':tw,'tileHeight':th,'originX':ox,'originY':oy,'boundsWidth':bw,'boundsHeight':bh,'entries':entries}

payload={'grid':grid(BIN/'main_grid.bin'),'islands':{}}
for index,suffix in [(1,'grass'),(2,'snow'),(3,'sand')]:payload['islands'][str(index)]=atlas(BIN/f'island0{index}_{suffix}.bin')
(ROOT/'assets/data/island-tiles.json').write_text(json.dumps(payload,separators=(',',':')))
print(len(payload['grid']['entries']),'tiles')
