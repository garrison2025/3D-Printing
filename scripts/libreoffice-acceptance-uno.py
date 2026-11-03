#!/usr/bin/python3
"""Use actual LibreOffice UNO edits and hard recalculation on the browser-downloaded workbook.
Requires LibreOffice Calc and python3-uno. This is not a Microsoft Excel product test."""
import math
from pathlib import Path
import subprocess
import tempfile
import time
import uno
from com.sun.star.beans import PropertyValue
from xml.etree import ElementTree as ET
from zipfile import ZipFile

source=Path('qa-fixtures/edited-current-inputs.xlsx').resolve()
assert source.is_file(), 'No real XLSX was downloaded by the preceding live browser test'
def prop(name,value):
 p=PropertyValue();p.Name=name;p.Value=value;return p
def approx(actual,expected,name):
 assert math.isclose(float(actual),expected,abs_tol=1e-7,rel_tol=1e-9),f'{name}: {actual!r} vs {expected!r}'
def saved_value(path,sheet,ref):
 with ZipFile(path) as z:xml=z.read(f'xl/worksheets/sheet{sheet}.xml')
 root=ET.fromstring(xml);n={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
 c=root.find(f".//m:c[@r='{ref}']",n)
 assert c is not None,f'{ref} missing in exported workbook'
 v=c.find('m:v',n)
 return None if v is None else v.text

with tempfile.TemporaryDirectory(prefix='printcost-uno-') as tmp:
 root=Path(tmp)
 port=20093
 process=subprocess.Popen(['libreoffice','-env:UserInstallation='+(root/'profile').as_uri(),
    '--headless','--norestore','--nodefault','--nofirststartwizard',
    '--accept=socket,host=127.0.0.1,port='+str(port)+';urp;StarOffice.ServiceManager'],
    stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 try:
  local=uno.getComponentContext()
  resolver=local.ServiceManager.createInstanceWithContext('com.sun.star.bridge.UnoUrlResolver',local)
  ctx=None
  for attempt in range(50):
   try:
    ctx=resolver.resolve('uno:socket,host=127.0.0.1,port='+str(port)+';urp;StarOffice.ComponentContext')
    break
   except Exception:
    if process.poll() is not None:raise RuntimeError('LibreOffice process exited prematurely')
    time.sleep(.2)
  assert ctx is not None,'Could not connect to real LibreOffice UNO calculation engine'
  desktop=ctx.ServiceManager.createInstanceWithContext('com.sun.star.frame.Desktop',ctx)
  def open_book():
   doc=desktop.loadComponentFromURL(uno.systemPathToFileUrl(str(source)),'_blank',0,(prop('Hidden',True),))
   assert doc is not None,'Cannot open real exported .xlsx in LibreOffice'
   return doc
  book=open_book()
  sh=book.Sheets.getByIndex(0)
  assert sh.getCellRangeByName('B8').Value==150,'Actual source workbook differs from browser QA'
  assert sh.getCellRangeByName('B26').Value==.22,'Maintenance source input missing'
  assert sh.getCellRangeByName('B27').Value==6.4,'Design source input missing'
  for cell,value in [('B8',200),('B26',.5),('B27',8.4)]:
   sh.getCellRangeByName(cell).Value=value
  book.calculateAll()
  attempt=200*25/1000+7.5*(120/1000)*.18+7.5*400/4000+10/60*15+7.5*.5
  item=attempt/(1-.1)/3+.5
  expenses=item*5+1.8+7+8.4
  required=(expenses+.3)/(1-.1-.35)
  peritem=math.ceil(((required-4.5)/5)*100-1e-9)/100
  gross=peritem*5+4.5;fee=.1*gross+.3;profit=gross-expenses-fee
  for cell,value in [('G13',item),('G14',expenses),('G16',peritem),('G17',gross),('G18',fee),('G19',profit)]:
   approx(sh.getCellRangeByName(cell).Value,value,'UNO Calc '+cell)
  assert sh.getCellRangeByName('G20').Value>=.35-1e-10,'LibreOffice margin did not meet input'
  sh2=book.Sheets.getByIndex(1)
  approx(sh2.getCellRangeByName('B6').Value,peritem,'Batch quote at quantity five')
  dest=root/'recalculated.xlsx'
  book.storeAsURL(uno.systemPathToFileUrl(str(dest)),(prop('FilterName','Calc MS Excel 2007 XML'),prop('Overwrite',True)))
  book.close(True)
  assert dest.is_file(),'LibreOffice did not save editable XLSX'
  for cell,value in [('G13',item),('G16',peritem),('G17',gross),('G19',profit)]:
   approx(saved_value(dest,1,cell),value,'Saved Excel '+cell)
  approx(saved_value(dest,2,'B6'),peritem,'Saved batch size-five quote')
  print('PASS LibreOffice UNO edited 3 actual XLSX cells, recalculated and re-saved customer quote, batch and profit')

  invalid=open_book()
  sheet=invalid.Sheets.getByIndex(0)
  sheet.getCellRangeByName('B17').Value=.97
  invalid.calculateAll()
  status=sheet.getCellRangeByName('G26').String
  display=sheet.getCellRangeByName('G16').String
  print('INVALID_INPUT_RESULT',repr(status),repr(display))
  assert 'INVALID' in status,'Failure rate above 95% is not rejected in LibreOffice'
  assert display.strip()=='','Invalid input must suppress checkout quote'
  invalid.close(True)
  print('PASS LibreOffice UNO invalid rate disables checkout quote')
 finally:
  process.terminate()
  try:process.wait(timeout=10)
  except subprocess.TimeoutExpired:process.kill()
print('LIBREOFFICE_UNO_ACCEPTANCE PASSED')
