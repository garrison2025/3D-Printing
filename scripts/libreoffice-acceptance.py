#!/usr/bin/env python3
"""Reopen a genuine downloaded user-input workbook in LibreOffice, recalculate and audit cells.
This is not a Microsoft Excel test. Uses ZIP/XML only for editing/inspection; LibreOffice computes."""
import math
import re
import subprocess
import sys
import tempfile
from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

original=Path('qa-fixtures/edited-current-inputs.xlsx')
if not original.is_file():
    raise SystemExit('Missing genuine-browser-downloaded personalized workbook')
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def get(xml,ref):
    root=ET.fromstring(xml)
    cell=root.find(f".//m:c[@r='{ref}']",ns)
    assert cell is not None, f'missing {ref}'
    value=cell.find('m:v',ns)
    return value.text if value is not None else None
def read(path,sheet,ref):
    with zipfile.ZipFile(path) as z:
        return get(z.read(f'xl/worksheets/sheet{sheet}.xml'),ref)
def patch_file(source,target,edits):
    with zipfile.ZipFile(source) as a,zipfile.ZipFile(target,'w') as out:
        for info in a.infolist():
            content=a.read(info.filename)
            if info.filename=='xl/worksheets/sheet1.xml':
                xml=content.decode('utf-8')
                for ref,val in edits.items():
                    pattern=re.compile(r'(<x:c\s+r="'+ref+r'"[^>]*>[\s\S]*?<x:v>)([^<]*)(</x:v>)')
                    xml,n=pattern.subn(lambda m:m.group(1)+str(val)+m.group(3),xml,count=1)
                    assert n==1, f'could not edit {ref}'
                content=xml.encode('utf-8')
            out.writestr(info,content)
def recalc(source,outdir):
    outdir.mkdir(parents=True,exist_ok=True)
    profile=outdir/'profile'
    cmd=['libreoffice','-env:UserInstallation='+profile.as_uri(),'--headless','--convert-to','xlsx:Calc MS Excel 2007 XML','--outdir',str(outdir),str(source)]
    run=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,timeout=90)
    print('LO_CONVERSION',run.returncode,run.stdout.strip()[:800])
    assert run.returncode==0, 'LibreOffice conversion failed'
    dest=outdir/source.name
    assert dest.is_file(), 'LibreOffice failed to save recalculated xlsx'
    return dest
def close(label,a,b):
    assert math.isclose(float(a),b,abs_tol=1e-7,rel_tol=1e-9),f'{label}: actual {a} != expected {b}'
with tempfile.TemporaryDirectory(prefix='printcost-lo-') as temp:
    root=Path(temp)
    valid=root/'modified.xlsx'
    patch_file(original,valid,{'B8':200,'B26':0.5,'B27':8.4})
    computed=recalc(valid,root/'calc')
    attempt=200*25/1000+7.5*(120/1000)*0.18+7.5*400/4000+10/60*15+7.5*0.5
    item=attempt/(1-0.10)/3+0.5
    expenses=item*5+1.8+7+8.4
    req=(expenses+0.3)/(1-0.10-0.35)
    price=math.ceil(((req-4.5)/5)*100-1e-9)/100
    gross=price*5+4.5
    fee=.10*gross+.3
    close('recalculated item G13',read(computed,1,'G13'),item)
    close('order expenses G14',read(computed,1,'G14'),expenses)
    close('whole cent unit price G16',read(computed,1,'G16'),price)
    close('checkout gross G17',read(computed,1,'G17'),gross)
    close('checkout fees G18',read(computed,1,'G18'),fee)
    close('checkout profit G19',read(computed,1,'G19'),gross-expenses-fee)
    assert float(read(computed,1,'G20'))>=0.35-1e-10,'margin under target'
    close('batch 5 unit price B6',read(computed,2,'B6'),price)
    print('PASS LibreOffice edited template: 3 modified input cells, recomputed real formulas, exact checkout and batch quotes',price)
    bad=root/'invalid.xlsx'
    patch_file(original,bad,{'B17':0.97})
    out=recalc(bad,root/'invalid-calc')
    status=str(read(out,1,'G26'))
    g16=read(out,1,'G16')
    print('LO_INVALID_STATUS',status,'G16',g16)
    assert status and 'INVALID' in status, 'invalid failure rate not rejected'
    assert g16 in ('',None), 'invalid inputs produced customer quote'
    print('PASS LibreOffice invalid inputs block quote')
print('LIBREOFFICE_ACCEPTANCE PASSED')
