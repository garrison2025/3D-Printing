# Design system

Product: PrintCost Studio. Market: US English, tool-first SEO. Users: FDM hobbyists and small print sellers. Primary journey: input slicer grams/time → read per-item cost → switch pricing/filament → optionally adjust order fees → copy/export/print.

Visual: light editorial workspace, not subscription marketing. Canvas #F5F7F7; surface #fff; ink #172B35; primary #155E75; quiet rules #DCE6E8; navy result #102D3D; positive #12604E. See `src/assets/theme-industrial.css` for the active tokens. System UI typography, tabular figures. 8px spacing rhythm, 12–17px radius. Desktop split roughly 60/40; below 930px stacked; below 620px compact mobile layout. Core controls and live outputs come before long-form SEO content. On phones, a compact introduction offers a direct link to the first input.

Motion: <200ms buttons/tabs and ~200ms cost bars, native CSS only; reduced-motion disables all. All input/labels/errors accessible via for/id and description references. No remote fonts/images. Hero and SVG brand are original; no competitor brand replicated. See BUILD-STATUS.md and CI for versioned browser evidence.
