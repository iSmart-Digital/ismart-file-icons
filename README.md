# @ismart/file-icons

SVG icon library with file type icons and product icons from Microsoft, Autodesk, Adobe, and Office 365. All icons are inline SVG strings — no fonts, no sprite sheets, no external requests.

## Installation

```bash
npm install @ismart/file-icons
```

## Quick start

```js
import { getIcon } from '@ismart/file-icons';

// File type icon for a .docx file — from the 'microsoft' vendor
const docxIcon = getIcon('microsoft', 'docx', 24);

// App icon for the Word application — from the 'office' vendor
const wordAppIcon = getIcon('office', 'word', 24);

// Inject into the DOM
document.getElementById('icon').innerHTML = docxIcon;
```

## Vendors

| Vendor | What it contains | Native size |
|---|---|---|
| `microsoft` | File type icons (`.docx`, `.pdf`, `.mp4`, …) from Microsoft Fluent UI | 20 px |
| `office` | App icons for Microsoft 365 products (Word, Teams, Copilot, …) | 20 px |
| `autodesk` | File type icons for Autodesk formats (`.dwg`, `.rvt`, `.f3d`, …) | 24 px |
| `adobe` | App icons for Adobe Creative Cloud products (Photoshop, Illustrator, …) | 40–64 px |

> **`microsoft` vs `office`** — `microsoft` holds icons that represent *file types* (what you'd show next to a filename). `office` holds icons that represent the *apps themselves* (what you'd show in a product list or navigation).

---

## API

### `getIcon(vendor, name, size?)`

Returns an SVG string, or `null` if the icon does not exist.

| Parameter | Type | Description |
|---|---|---|
| `vendor` | `string` | `'microsoft'`, `'autodesk'`, `'adobe'`, or `'office'` |
| `name` | `string` | Icon name (see tables below) |
| `size` | `number` | Optional. Sets `width` and `height` in pixels. Omit to keep the native size. |

Because icons are SVG, any size renders sharply — `16`, `20`, `24`, `32`, `48`, `64`, etc.

```js
getIcon('microsoft', 'docx', 20)       // Word document file type, 20×20
getIcon('autodesk', 'rvt', 24)         // Revit file type, 24×24
getIcon('adobe', 'photoshop', 40)      // Photoshop app icon, 40×40
getIcon('office', 'teams', 32)         // Teams app icon, 32×32
getIcon('microsoft', 'nonexistent')    // null
```

---

### `resizeSvg(svg, size)`

Utility that sets `width` and `height` on any SVG string. Useful when you already have an SVG string and just need to scale it.

```js
import { resizeSvg } from '@ismart/file-icons';

const big = resizeSvg(mySvg, 48);
```

---

### `icons`

Object mapping each vendor to its sorted list of available icon names.

```js
import { icons } from '@ismart/file-icons';

icons.microsoft   // ['accdb', 'archive', 'audio', ...]
icons.office      // ['access', 'clipchamp', 'copilot', ...]
icons.autodesk    // ['3ds', '3dx', 'archive', ...]
icons.adobe       // ['acrobat-pro', 'aero', 'after-effects', ...]

// Check if an icon exists before using it
if (icons.microsoft.includes('docx')) {
  const svg = getIcon('microsoft', 'docx', 24);
}
```

---

### Named exports

Every icon is also a named export containing the raw SVG string at its native size. Useful for bundlers that support tree-shaking.

The naming pattern is `icon_<vendor>_<name>` with hyphens replaced by underscores:

```js
import { icon_microsoft_docx } from '@ismart/file-icons';
import { icon_office_teams } from '@ismart/file-icons';
import { icon_adobe_after_effects } from '@ismart/file-icons';
import { icon_adobe_substance_3d_painter } from '@ismart/file-icons';
```

---

## Framework examples

### React

```tsx
import { getIcon } from '@ismart/file-icons';

interface FileIconProps {
  vendor: string;
  name: string;
  size?: number;
}

function FileIcon({ vendor, name, size = 24 }: FileIconProps) {
  const svg = getIcon(vendor, name, size);
  if (!svg) return null;
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Usage
<FileIcon vendor="microsoft" name="docx" size={24} />
<FileIcon vendor="office" name="teams" size={32} />
<FileIcon vendor="autodesk" name="dwg" size={24} />
```

### Vue 3

```vue
<template>
  <span v-html="svg" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getIcon } from '@ismart/file-icons';

const props = defineProps<{
  vendor: string;
  name: string;
  size?: number;
}>();

const svg = computed(() => getIcon(props.vendor, props.name, props.size ?? 24));
</script>

<!-- Usage -->
<FileIcon vendor="autodesk" name="dwg" :size="24" />
```

### TypeScript (Node / server-side)

```ts
import { getIcon, icons } from '@ismart/file-icons';

function resolveIcon(filename: string): string | null {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  // Check autodesk first, fall back to microsoft generic types
  return getIcon('autodesk', ext, 24) ?? getIcon('microsoft', ext, 24);
}
```

### Plain HTML (CDN)

```html
<div id="icon"></div>
<script type="module">
  import { getIcon } from 'https://cdn.jsdelivr.net/npm/@ismart/file-icons/dist/index.esm.js';
  document.getElementById('icon').innerHTML = getIcon('office', 'teams', 24);
</script>
```

---

## Available icons

### `microsoft` — file type icons (52)

`accdb` `archive` `audio` `calendar` `code` `contact` `csv` `docx` `dotx` `email` `exe` `folder` `font` `form` `genericfile` `html` `link` `listitem` `loop` `model` `mpp` `mpt` `multiple` `one` `onetoc` `pdf` `photo` `planner` `potx` `powerbi` `ppsx` `pptx` `presentation` `pub` `rtf` `sharedfolder` `spo` `spreadsheet` `stream` `sway` `txt` `vector` `video` `vsdx` `vssx` `vstx` `whiteboard` `xlsx` `xltx` `xml` `xsn` `zip`

### `office` — Microsoft 365 product icons (23)

`access` `clipchamp` `copilot` `excel` `forms` `lists` `loop` `onedrive` `onenote` `outlook` `powerbi` `powerpoint` `project` `publisher` `sharepoint` `stream` `sway` `teams` `todo` `visio` `whiteboard` `word` `yammer`

### `autodesk` — Autodesk file type icons (24)

`3ds` `3dx` `archive` `catproduct` `dwf` `dwfx` `dwg` `f3d` `genericfile` `idw` `ifc` `max` `nwc` `nwd` `obj` `pdf` `photo` `rvt` `txt` `usd` `usda` `usdc` `usdz` `video`

### `adobe` — Adobe Creative Cloud product icons (33)

`acrobat-pro` `aero` `after-effects` `animate` `audition` `behance` `bridge` `character-animator` `creative-cloud` `dimension` `dreamweaver` `express` `firefly` `fonts` `frame-io` `fresco` `illustrator` `incopy` `indesign` `lightroom` `lightroom-classic` `media-encoder` `photoshop` `portfolio` `premiere-pro` `premiere-rush` `stock` `substance-3d-designer` `substance-3d-modeler` `substance-3d-painter` `substance-3d-sampler` `substance-3d-stager` `xd`

---

## Publishing

```bash
npm publish
```

The `prepublishOnly` script runs the build automatically. The `dist/` folder is excluded from git but included in the npm package via the `files` field in `package.json`.

---

## Third-party licenses

Icons in this package are sourced from third-party CDNs and are subject to their respective terms:

- **Microsoft** icons (`microsoft`, `office`) — from the [Microsoft Fluent UI](https://github.com/microsoft/fluentui) CDN and the Office 365 brand icons CDN. Usage must comply with [Microsoft's brand guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks).
- **Adobe** icons (`adobe`) — from Adobe's Creative Cloud shared assets CDN. Usage must comply with [Adobe's brand guidelines](https://www.adobe.com/legal/permissions/trademarks.html).
- **Autodesk** icons (`autodesk`) — sourced from Autodesk Construction Cloud. Usage must comply with [Autodesk's brand guidelines](https://www.autodesk.com/company/legal-notices-trademarks/trademarks).
