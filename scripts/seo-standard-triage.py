#!/usr/bin/env python3
"""Review pinned Website-Starter-Standard SEO audit warnings without muting new issues.

The standard HTML-only scanner treats genuine .xlsx download links as HTML
targets and includes intentionally noindexed 404.html in its HTML inventory.
Whitelist only those exact, independently verifiable cases. All other
warning/error findings remain release blockers.
"""
import json
import pathlib
import sys
from urllib.parse import urlsplit

KNOWN_404 = {"CANONICAL_NONSELF", "NOINDEX", "ORPHAN_PAGE", "SITEMAP_PAGE_NOT_LISTED"}
EXPECTED_DOWNLOAD = "/assets/3d-print-cost-calculator-template.xlsx"

def approved(item,root):
    level=item.get("severity")
    code=item.get("code")
    page=item.get("page")
    detail=item.get("message","")
    if page=="/404.html" and code in KNOWN_404:
        html=(root/"404.html").read_text(encoding="utf-8",errors="replace")
        sitemap=(root/"sitemap.xml").read_text(encoding="utf-8",errors="replace")
        return ('<meta name="robots" content="noindex,nofollow">' in html
                and "<loc>https://3dprintcostcalculator.org/404/" not in sitemap
                and "<loc>https://3dprintcostcalculator.org/404.html" not in sitemap)
    if level=="warning" and code=="BROKEN_INTERNAL_LINK" and detail==EXPECTED_DOWNLOAD:
        return (root/EXPECTED_DOWNLOAD.lstrip("/")).is_file()
    return False

def main(argv):
    if len(argv)!=3:
        raise SystemExit("usage: seo-standard-triage.py report.json dist")
    report=json.loads(pathlib.Path(argv[1]).read_text(encoding="utf-8"))
    root=pathlib.Path(argv[2]).resolve()
    if not root.is_dir():
        raise SystemExit("Site output directory not found: "+str(root))
    known=[],unexpected=[]
    for f in report.get("findings",[]):
        (known if approved(f,root) else unexpected).append(f)
    print("Pinned standards audit: scanned",report.get("pages_scanned"),"HTML pages")
    print("Known, verified scanner exceptions:",len(known),"| Unexplained findings:",len(unexpected))
    for f in unexpected:
        print("UNEXPLAINED",f.get("severity"),f.get("code"),f.get("page"),f.get("message"))
    if not unexpected:
        print("PASS: all standard audit findings are explicitly verified exceptions")
    if unexpected:
        raise SystemExit(1)

if __name__=="__main__":
    main(sys.argv)
