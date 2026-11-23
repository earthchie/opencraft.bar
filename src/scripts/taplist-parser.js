/**
 * Tap list normaliser — BLF-first, legacy-compatible.
 *
 * The POS API currently returns one row per size variant with a legacy name
 * such as "1. [S] Schneider: Hopfenweisse, Weizendoppelbock 8.2%" and metadata
 * in `tags`. Newer payloads may instead carry BLF v1.0 lines (or a whole BLF
 * document). Both shapes are normalised into the same tap-card model so the
 * Taplist can follow https://opencraft.bar/th/standard/ without breaking the
 * live API.
 */

import { parseBlfLine } from './blf-parser.js';

const ORDER_PREFIX = /^(\d+)\s*\.\s*/;
const SIZE_MARKER = /\[([^\]\n]+)\]/;
const ABV_TOKEN = /^\d+(?:\.\d+)?%$/;
const SIZE_TOKEN = /^\d+(?:[.,]\d+)?\s*(?:ml|cl|l|oz)$/i;
const CURRENCY_TOKEN = /^[A-Z]{3}$/;
const CONTAINER_TOKEN = /^(?:draft|draught|bottle|can|keg|cask|growler|on tap|on-tap)$/i;

const isMetaTag = (tag) => {
  const value = String(tag ?? '').trim();
  return (
    value === '' ||
    /^style\s*:/i.test(value) ||
    ABV_TOKEN.test(value) ||
    SIZE_TOKEN.test(value) ||
    CURRENCY_TOKEN.test(value) ||
    CONTAINER_TOKEN.test(value)
  );
};

const unique = (values) => Array.from(new Set(values));

/**
 * Drop style tags that are just a concatenation of the other style values,
 * e.g. "DDHDWCIPA" when "DDH", "DWC", and "IPA" are also present.
 */
const dropConcatenatedStyles = (styles) =>
  styles.filter((style) => {
    const others = styles.filter((other) => other !== style);
    if (others.length < 2) return true;
    return !others.every((other) => style.toLowerCase().includes(other.toLowerCase()));
  });

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const formatVolume = (value) => `${value}`;

/** Add one raw entry (string or API row) to the record list. */
const addRecord = (records, entry, fallbackSource = null) => {
  if (typeof entry === 'string') {
    if (entry.trim()) records.push({ blf: entry.trim(), source: fallbackSource });
    return;
  }

  if (!entry || typeof entry !== 'object') return;

  if (typeof entry.blf === 'string' && entry.blf.trim()) {
    records.push({ blf: entry.blf.trim(), source: entry });
    return;
  }

  if (typeof entry.name === 'string' && entry.name.trim()) {
    records.push({ blf: entry.name.trim(), source: entry });
  }
};

/**
 * Pull BLF records out of every payload shape we accept:
 * a BLF text document, an array of strings/rows, or an object with
 * `items`, `blf`, `lines`, or `taplist`.
 */
export const extractTapRecords = (payload, rawText = '') => {
  const records = [];

  if (typeof payload === 'string') {
    rawText = payload;
  } else if (Array.isArray(payload)) {
    payload.forEach((entry) => addRecord(records, entry));
  } else if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.items)) {
      payload.items.forEach((entry) => addRecord(records, entry));
    } else if (typeof payload.blf === 'string') {
      rawText = payload.blf;
    } else if (typeof payload.lines === 'string') {
      rawText = payload.lines;
    } else if (typeof payload.taplist === 'string') {
      rawText = payload.taplist;
    }
  }

  if (records.length === 0 && typeof rawText === 'string' && rawText.trim()) {
    rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => records.push({ blf: line, source: null }));
  }

  return records;
};

/** Human-readable size cell: BLF container data first, then legacy [S] + tags. */
const describeSize = (item, sizeLabel, tags) => {
  if (item && item.containerSize) {
    const volume = `${formatVolume(item.containerSize.value)}${item.containerSize.unit}`;
    return item.containerType ? `${volume} · ${item.containerType}` : volume;
  }

  const volumeTag = tags.find((tag) => SIZE_TOKEN.test(tag.trim())) || '';
  if (sizeLabel && volumeTag) return `${sizeLabel} · ${volumeTag}`;
  return sizeLabel || volumeTag || '';
};

/** Retail price: the POS row price wins, then a BLF retail price (VAT-inclusive first). */
const resolvePrice = (source, item) => {
  const rowPrice = source ? Number(source.price) : Number.NaN;
  if (Number.isFinite(rowPrice) && rowPrice > 0) return rowPrice;

  if (item) {
    if (item.retailPriceIncVat !== null) return item.retailPriceIncVat;
    if (item.retailPriceExVat !== null) return item.retailPriceExVat;
  }

  return null;
};

/**
 * Normalise one BLF line (or a legacy "[S]" row) into a beer fragment.
 * Returns null when the line is empty.
 */
export const normalizeTapRecord = (record) => {
  if (!record || typeof record.blf !== 'string') return null;

  const source = record.source && typeof record.source === 'object' ? record.source : null;

  let text = record.blf.replace(/\s+/g, ' ').trim();
  if (!text) return null;

  // Legacy size marker: "1. [S] Producer: Beverage, Style 5%" → "1. Producer: ..."
  let sizeLabel = '';
  const marker = text.match(SIZE_MARKER);
  if (marker) {
    sizeLabel = marker[1].trim();
    text = text.replace(marker[0], ' ').replace(/\s+/g, ' ').trim();
  }

  const parsed = parseBlfLine(text);
  const item = parsed.ok ? parsed.item : null;

  const tags = Array.isArray(source?.tags) ? source.tags.map((tag) => String(tag)) : [];
  const tagBrewery = tags.find((tag) => !isMetaTag(tag)) || '';
  const brewery = tagBrewery || item?.producerName || '';

  const rawStyleTags = unique(
    tags
      .filter((tag) => /^style\s*:/i.test(tag))
      .map((tag) => tag.replace(/^style\s*:\s*/i, '').trim())
      .filter(Boolean)
  );
  const tagStyles = dropConcatenatedStyles(rawStyleTags);

  let styles = tagStyles;
  if (styles.length === 0 && item?.style) {
    const style = item.style.replace(/^style\s*:\s*/i, '').trim();
    if (style) styles = [style];
  }
  if (styles.length === 0) {
    const fallback = tags.find((tag) => !isMetaTag(tag) && tag !== brewery);
    if (fallback) styles = [fallback];
  }

  const abvTag = tags.find((tag) => ABV_TOKEN.test(tag.trim())) || '';
  const abv = abvTag
    ? Number.parseFloat(abvTag)
    : item && item.abv !== null
      ? item.abv
      : null;

  const orderFromName = text.match(ORDER_PREFIX);
  const tapNumber =
    item && item.orderNumber !== null
      ? item.orderNumber
      : orderFromName
        ? Number(orderFromName[1])
        : 0;

  // Beverage name: BLF's own field, else the head with producer and ABV removed.
  let labelName = item?.beverageName || '';
  if (!labelName) {
    let head = item?.producerName || text.replace(ORDER_PREFIX, '').trim();

    if (brewery && head.toLowerCase().startsWith(brewery.toLowerCase())) {
      head = head.slice(brewery.length).trim();
    }

    if (abvTag) {
      head = head.replace(new RegExp(`\\s*${escapeRegExp(abvTag)}$`, 'i'), '').trim();
    }

    labelName = head || brewery || text.replace(ORDER_PREFIX, '').trim();
  }

  return {
    key: `${brewery}|${labelName}|${abv ?? ''}`.toLowerCase(),
    tapNumber,
    brewery,
    labelName,
    abv,
    styles,
    currency: item?.currency || '',
    sizes: [
      {
        label: describeSize(item, sizeLabel, tags),
        price: resolvePrice(source, item),
      },
    ],
  };
};

/** Build the final, grouped, tap-number-ordered card list. */
export const buildTapList = (payload, rawText = '') => {
  const beers = new Map();

  for (const record of extractTapRecords(payload, rawText)) {
    const beer = normalizeTapRecord(record);
    if (!beer) continue;

    if (!beers.has(beer.key)) {
      beers.set(beer.key, { ...beer, sizes: [] });
    }

    beers.get(beer.key).sizes.push(...beer.sizes);
  }

  return Array.from(beers.values()).sort((a, b) => a.tapNumber - b.tapNumber);
};
