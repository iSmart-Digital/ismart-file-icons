# @ismart/file-icons

SVG icon library with file type icons and product icons from Microsoft, Autodesk, Adobe, and Office 365. All icons are inline SVG strings — no fonts, no sprite sheets, no external requests.

## Installation

```bash
npm install @ismart/file-icons
```

## Quick start

```js
import { getIcon } from '@ismart/file-icons';

// Get an icon at its native size
const svg = getIcon('microsoft', 'word');

// Get an icon resized to 24×24
const svg24 = getIcon('microsoft', 'word', 24);

// Inject into the DOM
document.getElementById('icon').innerHTML = svg24;
```

## API

### `getIcon(vendor, name, size?)`

Returns an SVG string, or `null` if the icon does not exist.

| Parameter | Type | Description |
|---|---|---|
| `vendor` | `string` | `'microsoft'`, `'autodesk'`, `'adobe'`, or `'office'` |
| `name` | `string` | Icon name (see tables below) |
| `size` | `number` | Optional. Sets `width` and `height` in pixels. Omit to keep the native size. |

Because all icons are SVG, any size looks sharp — `16`, `20`, `24`, `32`, `48`, `64`, etc.

```js
getIcon('microsoft', 'docx', 20)       // Word document, 20×20
getIcon('autodesk', 'rvt', 24)         // Revit file, 24×24
getIcon('adobe', 'photoshop', 40)      // Photoshop app icon, 40×40
getIcon('office', 'teams', 32)         // Teams product icon, 32×32
getIcon('microsoft', 'nonexistent')    // null
```

---

### `resizeSvg(svg, size)`

Utility that sets `width` and `height` on any SVG string. Useful when you already have an SVG and just need to scale it.

```js
import { resizeSvg } from '@ismart/file-icons';

const big = resizeSvg(mySvg, 48);
```

---

### `icons`

Object that maps each vendor to its list of available icon names. Use this to check what's available at runtime.

```js
import { icons } from '@ismart/file-icons';

console.log(icons.microsoft);
// ['accdb', 'archive', 'audio', 'calendar', ...]

console.log(Object.keys(icons));
// ['adobe', 'autodesk', 'microsoft', 'office']
```

---

### Named exports

Every icon is also a named export containing the raw SVG string at its native size. Useful for bundlers that support tree-shaking.

```js
import { icon_microsoft_docx, icon_office_teams } from '@ismart/file-icons';
```

The naming pattern is `icon_<vendor>_<name>` with hyphens replaced by underscores:

```js
import { icon_adobe_after_effects } from '@ismart/file-icons';
import { icon_adobe_substance_3d_painter } from '@ismart/file-icons';
```

---

## Framework examples

### React

```jsx
import { getIcon } from '@ismart/file-icons';

function FileIcon({ vendor, name, size = 24 }) {
  const svg = getIcon(vendor, name, size);
  if (!svg) return null;
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}

// Usage
<FileIcon vendor="microsoft" name="docx" size={24} />
<FileIcon vendor="office" name="teams" size={32} />
```

### Vue 3

```vue
<template>
  <span v-html="svg" />
</template>

<script setup>
import { computed } from 'vue';
import { getIcon } from '@ismart/file-icons';

const props = defineProps({
  vendor: String,
  name: String,
  size: { type: Number, default: 24 },
});

const svg = computed(() => getIcon(props.vendor, props.name, props.size));
</script>

<!-- Usage -->
<FileIcon vendor="autodesk" name="dwg" :size="24" />
```

### Plain HTML (CDN)

```html
<div id="icon"></div>
<script type="module">
  import { getIcon } from 'https://cdn.jsdelivr.net/npm/@ismart/file-icons/dist/index.esm.js';
  document.getElementById('icon').innerHTML = getIcon('office', 'word', 24);
</script>
```

---

## Available icons

### `microsoft` — file type icons (52)

File type icons from Microsoft Fluent UI.

`accdb` `archive` `audio` `calendar` `code` `contact` `csv` `docx` `dotx` `email` `exe` `folder` `font` `form` `genericfile` `html` `link` `listitem` `loop` `model` `mpp` `mpt` `multiple` `one` `onetoc` `pdf` `photo` `planner` `potx` `powerbi` `ppsx` `pptx` `presentation` `pub` `rtf` `sharedfolder` `spo` `spreadsheet` `stream` `sway` `txt` `vector` `video` `vsdx` `vssx` `vstx` `whiteboard` `xlsx` `xltx` `xml` `xsn` `zip`

---

### `office` — Microsoft 365 product icons (23)

App icons for Microsoft 365 products.

`access` `clipchamp` `copilot` `excel` `forms` `lists` `loop` `onedrive` `onenote` `outlook` `powerbi` `powerpoint` `project` `publisher` `sharepoint` `stream` `sway` `teams` `todo` `visio` `whiteboard` `word` `yammer`

---

### `autodesk` — Autodesk file type icons (24)

File type icons for Autodesk formats sourced from Autodesk Construction Cloud.

`3ds` `3dx` `archive` `catproduct` `dwf` `dwfx` `dwg` `f3d` `genericfile` `idw` `ifc` `max` `nwc` `nwd` `obj` `pdf` `photo` `rvt` `txt` `usd` `usda` `usdc` `usdz` `video`

---

### `adobe` — Adobe Creative Cloud product icons (33)

App icons for Adobe Creative Cloud products.

`acrobat-pro` `aero` `after-effects` `animate` `audition` `behance` `bridge` `character-animator` `creative-cloud` `dimension` `dreamweaver` `express` `firefly` `fonts` `frame-io` `fresco` `illustrator` `incopy` `indesign` `lightroom` `lightroom-classic` `media-encoder` `photoshop` `portfolio` `premiere-pro` `premiere-rush` `stock` `substance-3d-designer` `substance-3d-modeler` `substance-3d-painter` `substance-3d-sampler` `substance-3d-stager` `xd`

---

## Publishing

```bash
npm run build
npm publish
```

The `prepublishOnly` script runs the build automatically before every publish.
