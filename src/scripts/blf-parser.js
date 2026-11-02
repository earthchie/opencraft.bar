/**
 * BLF v1.0 reference parser — compact form.
 *
 * Usage:
 *   import { parseBlf } from './blf-parser.js';
 *   const { results, itemCount, warningCount, errorCount } = parseBlf(text);
 *
 * Each non-empty line is one record. The order number is optional; the
 * Producer Name is the only required field. Parameters are recognised by
 * their sigil or unit, so they may appear in any order. An optional ISO 4217
 * currency code (for example THB) applies to every amount in the record.
 */

const CONTAINER_TYPES = ['bottle', 'can', 'keg', 'cask', 'growler'];

// Use the runtime's ISO 4217 list when available; otherwise accept any
// uppercase three-letter token and let the caller validate it.
const CURRENCY_CODES =
  typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function'
    ? new Set(Intl.supportedValuesOf('currency'))
    : null;

const isCurrencyCode = (token) =>
  /^[A-Z]{3}$/.test(token) && (CURRENCY_CODES === null || CURRENCY_CODES.has(token));

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const normalizeContainer = (token) => {
  const match = CONTAINER_TYPES.find((type) => type === token.toLowerCase());
  return match ? match.charAt(0).toUpperCase() + match.slice(1) : null;
};

/**
 * Classify a whitespace-separated parameter token, or return null when the
 * token is not a parameter.
 */
const classifyToken = (token) => {
  if (/^@\d+(?:\.\d+)?v?$/i.test(token)) return 'cost';
  if (/^\/\d+(?:\.\d+)?v?$/i.test(token)) return 'retail';
  if (/^V\d+(?:\.\d+)?%?$/i.test(token)) return 'vat';
  if (/^x\d+$/i.test(token)) return 'stock';
  if (/^\d+(?:\.\d+)?%$/.test(token)) return 'abv';
  if (/^\d+(?:\.\d+)?(?:ml|cl|L|oz)$/i.test(token)) return 'size';
  if (normalizeContainer(token)) return 'container';
  if (isCurrencyCode(token)) return 'currency';
  if (/^\d+(?:\.\d+)?v$/i.test(token)) return 'inc';
  return null;
};

/**
 * Split the text after the order number into a name head and parameter
 * tokens. A token only starts the parameter section if it is a strong
 * parameter (not a bare container word), so names containing "Can" or
 * "Cask" survive better.
 */
const splitHeadAndParams = (text) => {
  const tokens = text.split(/\s+/).filter(Boolean);
  let firstParam = tokens.length;

  for (let i = 0; i < tokens.length; i += 1) {
    const kind = classifyToken(tokens[i]);
    if (kind && kind !== 'container') {
      firstParam = i;
      break;
    }
  }

  return {
    head: tokens.slice(0, firstParam).join(' '),
    params: tokens.slice(firstParam),
  };
};

/**
 * Parse the head into producer, beverage, and style.
 * With a colon:   producer : beverage , style
 * Without colon:  producer , style
 */
const parseHead = (head) => {
  const colon = head.indexOf(':');

  if (colon !== -1) {
    const producer = head.slice(0, colon).trim();
    const tail = head.slice(colon + 1).trim();
    const lastComma = tail.lastIndexOf(',');

    return {
      producer,
      beverage: lastComma === -1 ? tail || null : tail.slice(0, lastComma).trim() || null,
      style: lastComma === -1 ? null : tail.slice(lastComma + 1).trim() || null,
    };
  }

  const firstComma = head.indexOf(',');
  if (firstComma !== -1) {
    return {
      producer: head.slice(0, firstComma).trim(),
      beverage: null,
      style: head.slice(firstComma + 1).trim() || null,
    };
  }

  return { producer: head.trim(), beverage: null, style: null };
};

/**
 * Parse one compact BLF line.
 * Returns { lineNumber, raw, ok, item, warnings, error }.
 */
export const parseBlfLine = (raw, lineNumber = 1) => {
  const line = String(raw ?? '').trim();
  const result = {
    lineNumber,
    raw: line,
    ok: false,
    item: null,
    warnings: [],
    error: null,
  };

  if (!line) return result;

  // 1. Optional order number.
  let rest = line;
  let orderNumber = null;
  const orderMatch = rest.match(/^(\d+)\s*\.\s*/);
  if (orderMatch) {
    orderNumber = Number(orderMatch[1]);
    rest = rest.slice(orderMatch[0].length).trim();
  }

  // The examples write prices as "/ 320" with a space. Treat the space after
  // a price or cost sigil as optional so both "/320" and "/ 320" work.
  rest = rest.replace(/\/\s+(?=\d)/g, '/').replace(/@\s+(?=\d)/g, '@');

  // 2. Locate the first parameter token.
  const { head, params } = splitHeadAndParams(rest);
  const parsedHead = parseHead(head);

  if (!parsedHead.producer) {
    result.error = { code: 'missing-producer' };
    return result;
  }

  const item = {
    orderNumber,
    producerName: parsedHead.producer,
    beverageName: parsedHead.beverage,
    style: parsedHead.style,
    abv: null,
    containerSize: null,
    containerType: null,
    currency: null,
    costExVat: null,
    vatRate: null,
    costIncVat: null,
    stockAmount: null,
    retailPriceExVat: null,
    retailPriceIncVat: null,
  };

  // 3. Parse parameter tokens in order.
  let previousKind = null;

  for (const token of params) {
    const kind = classifyToken(token);

    if (kind === 'cost') {
      const match = token.match(/^@(\d+(?:\.\d+)?)(v)?$/i);
      if (match) {
        if (match[2]) item.costIncVat = Number(match[1]);
        else item.costExVat = Number(match[1]);
      }
    } else if (kind === 'retail') {
      const match = token.match(/^\/(\d+(?:\.\d+)?)(v)?$/i);
      if (match) {
        if (match[2]) item.retailPriceIncVat = Number(match[1]);
        else item.retailPriceExVat = Number(match[1]);
      }
    } else if (kind === 'vat') {
      item.vatRate = Number(token.slice(1).replace('%', ''));
    } else if (kind === 'stock') {
      item.stockAmount = Number(token.slice(1));
    } else if (kind === 'abv') {
      item.abv = Number(token.slice(0, -1));
    } else if (kind === 'size') {
      // oz is a US fluid ounce (29.5735 ml); the original unit is preserved.
      const match = token.match(/^(\d+(?:\.\d+)?)(ml|cl|L|oz)$/i);
      if (match) {
        item.containerSize = {
          value: Number(match[1]),
          unit: match[2].toLowerCase() === 'l' ? 'L' : match[2].toLowerCase(),
        };
      }
    } else if (kind === 'container') {
      item.containerType = normalizeContainer(token);
    } else if (kind === 'currency') {
      item.currency = token.toUpperCase();
    } else if (kind === 'inc') {
      const value = Number(token.slice(0, -1));

      if (previousKind === 'retail') item.retailPriceIncVat = value;
      else if (previousKind === 'cost' || previousKind === 'vat') item.costIncVat = value;
      else if (item.retailPriceExVat !== null && item.retailPriceIncVat === null) {
        item.retailPriceIncVat = value;
      } else if (item.costExVat !== null && item.costIncVat === null) {
        item.costIncVat = value;
      } else {
        result.warnings.push({ code: 'unknown-token', token });
      }
    } else {
      result.warnings.push({ code: 'unknown-token', token });
    }

    if (kind) previousKind = kind;
  }

  // 4. Validate stated VAT pairs when a rate is present.
  if (item.vatRate !== null) {
    const factor = 1 + item.vatRate / 100;

    const checks = [
      ['cost', item.costExVat, item.costIncVat],
      ['retail', item.retailPriceExVat, item.retailPriceIncVat],
    ];

    for (const [field, exclusive, inclusive] of checks) {
      if (exclusive === null || inclusive === null) continue;

      const expected = round2(exclusive * factor);
      if (Math.abs(expected - inclusive) > 0.01) {
        result.warnings.push({
          code: 'vat-mismatch',
          field,
          expected,
          actual: inclusive,
        });
      }
    }
  }

  result.item = item;
  result.ok = true;
  return result;
};

/**
 * Parse a multi-line BLF document.
 * Blank lines are skipped; every other line becomes a result in input order.
 */
export const parseBlf = (text) => {
  const results = [];
  const lines = String(text ?? '').split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.trim() === '') return;
    results.push(parseBlfLine(line, index + 1));
  });

  return {
    results,
    itemCount: results.filter((entry) => entry.ok).length,
    warningCount: results.reduce((total, entry) => total + entry.warnings.length, 0),
    errorCount: results.filter((entry) => !entry.ok).length,
  };
};
