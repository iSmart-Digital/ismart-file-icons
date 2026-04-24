const fs = require('fs');
const path = require('path');

const iconsRoot = path.join(__dirname, '..', 'icons');
const distDir = path.join(__dirname, '..', 'dist');

// Walk icons/<vendor>/<sizeDir>/*.svg — size directory is just for organisation, not exposed in API
function collectIcons() {
  const result = {}; // { vendor: { name: svgString } }
  for (const vendor of fs.readdirSync(iconsRoot).sort()) {
    const vendorPath = path.join(iconsRoot, vendor);
    if (!fs.statSync(vendorPath).isDirectory()) continue;
    result[vendor] = {};
    for (const sizeDir of fs.readdirSync(vendorPath).sort()) {
      const sizePath = path.join(vendorPath, sizeDir);
      if (!fs.statSync(sizePath).isDirectory()) continue;
      for (const file of fs.readdirSync(sizePath).sort()) {
        if (!file.endsWith('.svg')) continue;
        const name = path.basename(file, '.svg');
        result[vendor][name] = fs.readFileSync(path.join(sizePath, file), 'utf8').trim();
      }
    }
  }
  return result;
}

const data = collectIcons();

const allEntries = [];
for (const [vendor, icons] of Object.entries(data)) {
  for (const [name, svg] of Object.entries(icons)) {
    allEntries.push({ vendor, name, svg });
  }
}

// Safe JS identifier: replace hyphens and dots with underscores
function toIdentifier(vendor, name) {
  return `icon_${vendor}_${name}`.replace(/[-. ]/g, '_');
}

const resizeSvgBody = `\
function resizeSvg(svg, size) {
  if (size == null) return svg;
  return svg.replace(/<svg([^>]*)>/, function(_, attrs) {
    var a = attrs.replace(/\\s+width="[^"]*"/, '').replace(/\\s+height="[^"]*"/, '');
    return '<svg' + a + ' width="' + size + '" height="' + size + '">';
  });
}`;

const namespaceIdsFnBody = `\
var _idSeq = 0;
function namespaceIds(svg, prefix) {
  if (prefix == null) prefix = 'i' + (++_idSeq) + '_';
  var ids = [];
  svg.replace(/\\bid="([^"]+)"/g, function(_, id) { ids.push(id); });
  if (!ids.length) return svg;
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i], nid = prefix + id;
    svg = svg
      .split('id="' + id + '"').join('id="' + nid + '"')
      .split('url(#' + id + ')').join('url(#' + nid + ')')
      .split('href="#' + id + '"').join('href="#' + nid + '"')
      .split('xlink:href="#' + id + '"').join('xlink:href="#' + nid + '"');
  }
  return svg;
}`;

const getIconBody = `\
function getIcon(vendor, name, size, options) {
  var svg = _svgMap[vendor] && _svgMap[vendor][name];
  if (!svg) return null;
  var uniqueIds = !options || options.uniqueIds !== false;
  if (uniqueIds) svg = namespaceIds(svg, options && options.idPrefix);
  return resizeSvg(svg, size);
}`;

// ── CJS ──────────────────────────────────────────────────────────────────────
const cjs = ["'use strict';", ''];

for (const { vendor, name, svg } of allEntries) {
  cjs.push(`exports.${toIdentifier(vendor, name)} = ${JSON.stringify(svg)};`);
}

cjs.push('');
cjs.push('var _svgMap = {};');
for (const [vendor, icons] of Object.entries(data)) {
  cjs.push(`_svgMap[${JSON.stringify(vendor)}] = {`);
  for (const [name, svg] of Object.entries(icons)) {
    cjs.push(`  ${JSON.stringify(name)}: ${JSON.stringify(svg)},`);
  }
  cjs.push('};');
}

cjs.push('');
cjs.push(namespaceIdsFnBody);
cjs.push('exports.namespaceIds = namespaceIds;');
cjs.push('');
cjs.push(resizeSvgBody);
cjs.push('exports.resizeSvg = resizeSvg;');
cjs.push('');
cjs.push(getIconBody);
cjs.push('exports.getIcon = getIcon;');
cjs.push('');

const iconsObj = JSON.stringify(
  Object.fromEntries(Object.entries(data).map(([v, icons]) => [v, Object.keys(icons).sort()])),
  null, 2
);
cjs.push('exports.icons = ' + iconsObj + ';');

// ── ESM ──────────────────────────────────────────────────────────────────────
const esm = [];

for (const { vendor, name, svg } of allEntries) {
  esm.push(`export var ${toIdentifier(vendor, name)} = ${JSON.stringify(svg)};`);
}

esm.push('');
esm.push('var _svgMap = {};');
for (const [vendor, icons] of Object.entries(data)) {
  esm.push(`_svgMap[${JSON.stringify(vendor)}] = {`);
  for (const [name, svg] of Object.entries(icons)) {
    esm.push(`  ${JSON.stringify(name)}: ${JSON.stringify(svg)},`);
  }
  esm.push('};');
}

esm.push('');
esm.push('export ' + namespaceIdsFnBody);
esm.push('');
esm.push('export ' + resizeSvgBody);
esm.push('');
esm.push('export ' + getIconBody);
esm.push('');
esm.push('export var icons = ' + iconsObj + ';');

// ── DTS ──────────────────────────────────────────────────────────────────────
const dts = [];

for (const { vendor, name } of allEntries) {
  dts.push(`export declare const ${toIdentifier(vendor, name)}: string;`);
}

dts.push('');
dts.push('export interface GetIconOptions { uniqueIds?: boolean; idPrefix?: string; }');
dts.push('export declare function namespaceIds(svg: string, prefix?: string): string;');
dts.push('export declare function resizeSvg(svg: string, size: number): string;');
dts.push('export declare function getIcon(vendor: string, name: string, size?: number, options?: GetIconOptions): string | null;');
dts.push('export declare const icons: Record<string, string[]>;');

// ── Write ─────────────────────────────────────────────────────────────────────
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
fs.writeFileSync(path.join(distDir, 'index.js'), cjs.join('\n'));
fs.writeFileSync(path.join(distDir, 'index.esm.js'), esm.join('\n'));
fs.writeFileSync(path.join(distDir, 'index.d.ts'), dts.join('\n'));

console.log(`Built ${allEntries.length} icons across ${Object.keys(data).length} vendor(s) -> dist/`);
for (const [vendor, icons] of Object.entries(data)) {
  console.log(`  ${vendor}: ${Object.keys(icons).length} icons`);
}
