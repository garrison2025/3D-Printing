#!/usr/bin/env python3
"""Validate Open XML markup in every workbook member, not just ZIP headers."""
import io
import sys
import zipfile
from xml.etree import ElementTree as ET

for name in sys.argv[1:]:
    with zipfile.ZipFile(name) as z:
        parts=[i for i in z.namelist() if i.endswith(('.xml','.rels'))]
        assert parts, f'{name}: no OOXML documents'
        for part in parts:
            try:
                ET.fromstring(z.read(part))
            except ET.ParseError as error:
                raise SystemExit(f'INVALID OOXML {name}::{part} — {error}') from error
        assert 'xl/worksheets/sheet1.xml' in parts, f'{name}: missing main sheet'
    print(f'PASS OOXML {name}: {len(parts)} XML parts are well formed')
