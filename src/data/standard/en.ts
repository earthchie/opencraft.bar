import type { StandardContent } from './types';

export const en: StandardContent = {
  meta: {
    title: 'BLF — Beverage Line Format Specification',
    description:
      'BLF v1.0 is an open, human-readable and machine-parsable line format for beverage data, proposed by OpenCraft.',
  },

  playground: {
    label: 'BLF v1.0 · Live check',
    description: 'Paste or type one compact BLF record per line. Cards update as you type.',
    inputLabel: 'Your BLF input',
    outputLabel: 'Parsed items',
    sampleButton: 'Load sample',
    clearButton: 'Clear',
    empty: 'Paste a BLF line above to see parsed cards.',
    statusParsed: 'Parsed',
    statusWarnings: 'Warnings',
    statusErrors: 'Errors',
    lineLabel: 'Line',
    unknownToken: 'Unknown token: {token}',
    vatMismatch: 'VAT mismatch ({field}): expected {expected}, got {actual}',
    missingProducer: 'Producer Name is required.',
    labels: {
      order: 'Order',
      producer: 'Producer',
      beverage: 'Beverage',
      style: 'Style',
      abv: 'ABV',
      size: 'Size',
      container: 'Container',
      currency: 'Currency',
      costExVat: 'Cost (ex VAT)',
      costIncVat: 'Cost (inc VAT)',
      vat: 'VAT',
      stock: 'Stock',
      retailPriceExVat: 'Retail (ex VAT)',
      retailPriceIncVat: 'Retail (inc VAT)',
    },
  },

  hero: {
    eyebrow: 'Open specification · Version 1.0',
    title: 'OpenCraft Beverage Line Format',
    acronym: 'BLF',
    subtitle:
      'A shared language for beverage lists — readable by people, parsable by machines, and built for every drink.',
    published: 'Published by OpenCraft · 3 November 2026',
    chips: [
      'One line, one product',
      'Only the producer is required',
      'Built for every beverage',
      'Versioned · v1.0',
    ],
  },

  toc: {
    label: 'On this page',
    items: [
      { id: 'why', label: 'Why BLF' },
      { id: 'anatomy', label: 'One-line anatomy' },
      { id: 'fields', label: 'Field reference' },
      { id: 'forms', label: 'Compact & expanded' },
      { id: 'vat', label: 'VAT rules' },
      { id: 'examples', label: 'Examples' },
      { id: 'machine', label: 'For developers' },
      { id: 'beyond', label: 'Beyond beer' },
      { id: 'roadmap', label: 'Limitations & roadmap' },
      { id: 'feedback', label: 'Feedback' },
    ],
  },

  why: {
    heading: 'Why BLF',
    lead: [
      'Beverage lists travel between producers, distributors, bars, and customers every day — through chat messages, printed menus, spreadsheets, and order forms. Every sender invents a slightly different layout, so every receiver re-types the data.',
      'BLF (Beverage Line Format) is a small, line-oriented standard proposed by OpenCraft. One line describes one beverage: who makes it, what it is, how strong it is, how it is packaged, what it costs, how many are left, and what it sells for. A human can read it at a glance; a machine can parse it with a handful of deterministic rules.',
    ],
    principles: [
      {
        icon: '👁️',
        title: 'Human first',
        body: 'A line must be understandable to a bartender or buyer without any tooling. No XML, no nested objects — just text.',
      },
      {
        icon: '⚙️',
        title: 'Machine by rule',
        body: 'Every token has an unambiguous prefix, suffix, or unit. Parsers never need to guess where a field ends.',
      },
      {
        icon: '◻️',
        title: 'Optional by default',
        body: 'Only Producer Name is mandatory. A list can start minimal and grow richer over time without breaking.',
      },
      {
        icon: '🧩',
        title: 'Extensible vocabulary',
        body: 'Container types and styles are controlled lists that can grow. BLF is a beverage format, not a beer-only format.',
      },
    ],
  },

  anatomy: {
    heading: 'Anatomy of one line',
    lead: 'Read left to right. The order number and the producer form the head of the line. Everything after it is a parameter, identified by its own sigil, unit, or currency code rather than by position.',
    pattern:
      '<order>. <producer>: <beverage>, <style> <abv> <size> <container> <currency> @<cost> [V<vat>] [@<cost-incl>v] x<stock> / <price> [<price-incl>v]',
    patternLabel: 'Pattern',
    exampleLabel: 'Example',
    exampleSegments: [
      { text: '2.', kind: 'order' },
      { text: ' ', kind: 'plain' },
      { text: 'Sample Brewing', kind: 'producer' },
      { text: ':', kind: 'plain' },
      { text: ' ', kind: 'plain' },
      { text: 'Sea Breeze', kind: 'beverage' },
      { text: ',', kind: 'plain' },
      { text: ' ', kind: 'plain' },
      { text: 'Pale Ale', kind: 'style' },
      { text: ' ', kind: 'plain' },
      { text: '5%', kind: 'abv' },
      { text: ' ', kind: 'plain' },
      { text: '440ml', kind: 'size' },
      { text: ' ', kind: 'plain' },
      { text: 'Can', kind: 'container' },
      { text: ' ', kind: 'plain' },
      { text: 'THB', kind: 'currency' },
      { text: ' ', kind: 'plain' },
      { text: '@180', kind: 'cost' },
      { text: ' ', kind: 'plain' },
      { text: 'V7.0', kind: 'vat' },
      { text: ' ', kind: 'plain' },
      { text: '@192.6v', kind: 'costInc' },
      { text: ' ', kind: 'plain' },
      { text: 'x8', kind: 'stock' },
      { text: ' ', kind: 'plain' },
      { text: '/320', kind: 'price' },
      { text: ' ', kind: 'plain' },
      { text: '342.4v', kind: 'priceInc' },
    ],
    tokenHeaders: ['Token', 'Field', 'Meaning'],
    tokens: [
      { token: '2.', field: 'Order Number', note: 'Index within the list. Not a product ID.' },
      { token: 'Sample Brewing', field: 'Producer Name', note: 'The only required field. Ends at the colon.' },
      { token: 'Sea Breeze', field: 'Beverage Name', note: 'After the colon, before the last comma.' },
      { token: 'Pale Ale', field: 'Style', note: 'After the last comma in the head.' },
      { token: '5%', field: 'ABV', note: 'Alcohol by volume. Decimals are allowed.' },
      { token: '440ml', field: 'Container Size', note: 'Units: ml, cl, L, or oz.' },
      { token: 'Can', field: 'Container Type', note: 'Can, Bottle, Keg, Cask, Growler, and future additions.' },
      { token: 'THB', field: 'Currency', note: 'ISO 4217 code. Applies to every amount in the record.' },
      { token: '@180', field: 'Cost (VAT excluded)', note: 'Per container, in the stated or agreed currency.' },
      { token: 'V7.0', field: 'VAT rate', note: 'Percent. Applies to the whole record.' },
      { token: '@192.6v', field: 'Cost (VAT included)', note: 'The v suffix marks a VAT-inclusive amount.' },
      { token: 'x8', field: 'Stock Amount', note: 'Integer count of containers.' },
      { token: '/320', field: 'Retail Price (VAT excluded)', note: 'Per container.' },
      { token: '342.4v', field: 'Retail Price (VAT included)', note: 'The v suffix marks a VAT-inclusive amount.' },
    ],
    footnote:
      'Parameters are order-independent: 5% 440ml Can and 440ml 5% Can describe the same product. The order shown above is the recommended canonical order. The order number is optional too — when it is omitted, the line starts with the producer.',
  },

  fields: {
    heading: 'Field reference',
    lead: 'Every field is optional except Producer Name. The order below is the recommended canonical order for both compact and expanded forms.',
    headers: ['Field', 'Required', 'Syntax', 'Notes'],
    required: 'Required',
    optional: 'Optional',
    rows: [
      {
        field: 'Order Number',
        required: false,
        syntax: '1.',
        notes: 'Line index. Unique within a published list. Display order only — not a stable product identifier.',
      },
      {
        field: 'Producer Name',
        required: true,
        syntax: 'Sample Brewing:',
        notes: 'Brand, brewery, or producer. May contain commas; the field ends at the colon.',
      },
      {
        field: 'Beverage Name',
        required: false,
        syntax: 'Sea Breeze,',
        notes: 'Product name. Split from Style at the last comma in the head.',
      },
      {
        field: 'Style',
        required: false,
        syntax: 'Pale Ale',
        notes: 'Free text in v1.0. A shared style registry is planned.',
      },
      {
        field: 'ABV',
        required: false,
        syntax: '5%',
        notes: 'Alcohol by volume as a percentage. Decimals are allowed; 0% is valid.',
      },
      {
        field: 'Container Size',
        required: false,
        syntax: '440ml',
        notes: 'Number plus unit: ml, cl, L, or oz. oz is a US fluid ounce (29.5735 ml). Normalize to millilitres when comparing.',
      },
      {
        field: 'Container Type',
        required: false,
        syntax: 'Can',
        notes: 'Can, Bottle, Keg, Cask, Growler, and future additions. Extensible.',
      },
      {
        field: 'Currency',
        required: false,
        syntax: 'THB',
        notes: 'ISO 4217 code. Applies to every amount in the record. When omitted, the list’s agreed currency applies.',
      },
      {
        field: 'Cost (VAT excluded)',
        required: false,
        syntax: '@180',
        notes: 'Cost per container, in the stated or agreed currency. Cost is shorthand for this field.',
      },
      {
        field: 'VAT rate',
        required: false,
        syntax: 'V7.0',
        notes: 'Percent, applied to every amount in the record. In Thailand, 7.0.',
      },
      {
        field: 'Cost (VAT included)',
        required: false,
        syntax: '@192.6v',
        notes: 'Stated or derived. The v suffix is mandatory.',
      },
      {
        field: 'Stock Amount',
        required: false,
        syntax: 'x8',
        notes: 'Integer count of containers — cans, bottles, or kegs, not servings.',
      },
      {
        field: 'Retail Price (VAT excluded)',
        required: false,
        syntax: '/320',
        notes: 'Price per container. Retail Price is shorthand for this field.',
      },
      {
        field: 'Retail Price (VAT included)',
        required: false,
        syntax: '342.4v',
        notes: 'Stated or derived. The v suffix is mandatory.',
      },
    ],
    footnote:
      'An amount written without a v suffix is VAT-excluded. When Currency is omitted, amounts use the list’s agreed currency; a single record should not mix currencies.',
  },

  forms: {
    heading: 'Two equivalent forms',
    lead: 'The compact form is built for chat messages and shelf labels. The expanded form is built for review, editing, and version control. Both carry the same data and convert to each other without loss.',
    compact: {
      title: 'Compact form — one line per product',
      body: 'The order number and producer lead the line; parameters follow, each identified by a sigil, unit, or ISO currency code. Position carries no meaning, so the canonical order is a readability convention rather than a parsing requirement.',
      code: `1. Mock Brewery: Night Owl, Chocolate Milk Stout 5.6% 12oz Bottle THB @120 x5 / 260
2. Sample Brewing: Sea Breeze, Pale Ale 5% 440ml Can THB @180 V7.0 @192.6v x8 / 320 342.4v
3. Demo Lagerhaus, Munich Helles 5.5%`,
      notes: [
        'Parameters are detected by @, V, x, / and units such as %, ml, and L.',
        'Amounts use a dot decimal. Never use thousands separators inside an amount.',
        'One record per line. Blank lines between records are allowed.',
        'Keywords and units are case-insensitive; the capitalization shown here is canonical.',
        'Currency is a standalone ISO 4217 code such as THB, placed before the first amount.',
        'A space after @ or / is allowed, so @180 and @ 180 are equivalent.',
        'Publish one line per sellable container variant — 330ml and 500ml of the same beer are two lines.',
        'If a name contains a token-like fragment, or the style contains a comma, use the expanded form instead.',
      ],
    },
    expanded: {
      title: 'Expanded form — one field per line',
      body: 'Write Key: Value, and separate records with a blank line. This form is easier to review, diff, and enter by hand. It is the safest choice when names contain commas, numbers, or units.',
      code: `Order Number: 2
Producer Name: Sample Brewing
Beverage Name: Sea Breeze
Style: Pale Ale
ABV: 5%
Container Size: 440ml
Container Type: Can
Currency: THB
Cost (VAT Excluded): 180
VAT: 7.0%
Cost (VAT Included): 192.6
Stock Amount: 8
Retail Price (VAT Excluded): 320
Retail Price (VAT Included): 342.4`,
      notes: [
        'Field names are case-insensitive; use the canonical spelling when publishing.',
        'Cost and Retail Price are accepted aliases for the VAT-excluded fields.',
        'Readers should ignore unknown fields rather than reject the record.',
        'A blank line terminates a record; omitted fields are simply absent.',
      ],
    },
  },

  vat: {
    heading: 'VAT rules',
    lead: 'Money is VAT-excluded by default because that is how most trade lists are quoted. The v suffix marks an amount that already includes VAT. Both can coexist in one record.',
    rules: [
      {
        title: 'The default is VAT-excluded',
        body: 'Any amount without a v suffix is treated as VAT-excluded. This applies to both cost and retail price.',
      },
      {
        title: 'v marks a VAT-inclusive amount',
        body: 'Attach v directly to the amount: @192.6v or /342.4v. A bare amount ending in v immediately after the matching exclusive amount is also accepted, but that form is positional — for new lists, prefer the sigil-attached form.',
      },
      {
        title: 'V<rate> declares the rate',
        body: 'The rate applies to every amount in the record. In Thailand the standard rate is V7.0.',
      },
      {
        title: 'Deriving the inclusive amount',
        body: 'With a known exclusive amount and rate, compute amount × (1 + rate / 100), rounded half-up to two decimal places.',
      },
      {
        title: 'Consistency is checked',
        body: 'If a record states both exclusive and inclusive amounts, they should differ by no more than 0.01. A larger gap is a data error.',
      },
      {
        title: 'A rate is not always required',
        body: 'An amount may be marked v without a stated rate. The amount is then known to include VAT, but the rate is unknown — do not infer it.',
      },
    ],
    exampleTitle: 'Worked example: record 2',
    exampleCode: `Currency: THB
Cost (VAT Excluded): 180
VAT: 7.0%
Cost (VAT Included): 192.6
Retail Price (VAT Excluded): 320
Retail Price (VAT Included): 342.4`,
    exampleNote: '180 × 1.07 = 192.60 and 320 × 1.07 = 342.40, both exact to two decimal places.',
  },

  examples: {
    heading: 'Six mock examples',
    lead: 'The six records below are fictional mock data, included to exercise every part of the format. Each card shows the compact line and its expanded fields.',
    expandedLabel: 'Expanded fields',
    cards: [
      {
        title: 'Mock Brewery — Night Owl',
        compact: '1. Mock Brewery: Night Owl, Chocolate Milk Stout 5.6% 12oz Bottle THB @120 x5 / 260',
        fields: [
          { key: 'Order Number', value: '1' },
          { key: 'Producer Name', value: 'Mock Brewery' },
          { key: 'Beverage Name', value: 'Night Owl' },
          { key: 'Style', value: 'Chocolate Milk Stout' },
          { key: 'ABV', value: '5.6%' },
          { key: 'Container Size', value: '12oz' },
          { key: 'Container Type', value: 'Bottle' },
          { key: 'Currency', value: 'THB' },
          { key: 'Cost (VAT Excluded)', value: '120' },
          { key: 'Stock Amount', value: '5' },
          { key: 'Retail Price (VAT Excluded)', value: '260' },
        ],
        note: 'No VAT is stated, so both monetary amounts are VAT-excluded by default. The 12oz bottle demonstrates the oz size unit.',
      },
      {
        title: 'Sample Brewing — Sea Breeze',
        compact: '2. Sample Brewing: Sea Breeze, Pale Ale 5% 440ml Can THB @180 V7.0 @192.6v x8 / 320 342.4v',
        fields: [
          { key: 'Order Number', value: '2' },
          { key: 'Producer Name', value: 'Sample Brewing' },
          { key: 'Beverage Name', value: 'Sea Breeze' },
          { key: 'Style', value: 'Pale Ale' },
          { key: 'ABV', value: '5%' },
          { key: 'Container Size', value: '440ml' },
          { key: 'Container Type', value: 'Can' },
          { key: 'Currency', value: 'THB' },
          { key: 'Cost (VAT Excluded)', value: '180' },
          { key: 'VAT', value: '7.0%' },
          { key: 'Cost (VAT Included)', value: '192.6' },
          { key: 'Stock Amount', value: '8' },
          { key: 'Retail Price (VAT Excluded)', value: '320' },
          { key: 'Retail Price (VAT Included)', value: '342.4' },
        ],
        note: 'The fullest mock record: rate, stock, and both VAT variants of cost and price are present.',
      },
      {
        title: 'Sample Brewing — Sunbeam',
        compact: '3. Sample Brewing: Sunbeam, Fruity Pale Ale 4.8% 440ml Can THB @150v x10 / 280v',
        fields: [
          { key: 'Order Number', value: '3' },
          { key: 'Producer Name', value: 'Sample Brewing' },
          { key: 'Beverage Name', value: 'Sunbeam' },
          { key: 'Style', value: 'Fruity Pale Ale' },
          { key: 'ABV', value: '4.8%' },
          { key: 'Container Size', value: '440ml' },
          { key: 'Container Type', value: 'Can' },
          { key: 'Currency', value: 'THB' },
          { key: 'Cost (VAT Included)', value: '150' },
          { key: 'Stock Amount', value: '10' },
          { key: 'Retail Price (VAT Included)', value: '280' },
        ],
        note: 'VAT-inclusive amounts without a stated rate are valid. The rate stays unknown rather than being guessed.',
      },
      {
        title: 'Demo Lagerhaus — Munich Helles',
        compact: '4. Demo Lagerhaus, Munich Helles 5.5%',
        fields: [
          { key: 'Order Number', value: '4' },
          { key: 'Producer Name', value: 'Demo Lagerhaus' },
          { key: 'Style', value: 'Munich Helles' },
          { key: 'ABV', value: '5.5%' },
        ],
        note: 'No colon: the comma separates the producer from the style, and there is no beverage name.',
      },
      {
        title: 'Mock Cocktail Co. — Citrus Club',
        compact: '5. Mock Cocktail Co.: Citrus Club, Pre-made Cocktail 330ml 5%',
        fields: [
          { key: 'Order Number', value: '5' },
          { key: 'Producer Name', value: 'Mock Cocktail Co.' },
          { key: 'Beverage Name', value: 'Citrus Club' },
          { key: 'Style', value: 'Pre-made Cocktail' },
          { key: 'Container Size', value: '330ml' },
          { key: 'ABV', value: '5%' },
        ],
        note: 'Size appears before ABV — parameters are order-independent. This is a non-beer beverage in the same format.',
      },
      {
        title: 'Demo Brewing — Love, Laugh, and Sorrow',
        compact: '6. Demo Brewing: Love, Laugh, and Sorrow, QDH Hazy IPA 7.5% 20L Keg',
        fields: [
          { key: 'Order Number', value: '6' },
          { key: 'Producer Name', value: 'Demo Brewing' },
          { key: 'Beverage Name', value: 'Love, Laugh, and Sorrow' },
          { key: 'Style', value: 'QDH Hazy IPA' },
          { key: 'ABV', value: '7.5%' },
          { key: 'Container Size', value: '20L' },
          { key: 'Container Type', value: 'Keg' },
        ],
        note: 'The last comma separates the beverage name from the style, so commas inside the beverage name are safe.',
      },
    ],
  },

  machine: {
    heading: 'For developers',
    lead: 'BLF is designed to be tokenized with a handful of regular expressions and a short set of rules. No dedicated library is required.',
    tokenHeaders: ['Token', 'Pattern'],
    tokenRows: [
      { token: 'Order Number', pattern: '^\\d+\\.' },
      { token: 'ABV', pattern: '\\d+(?:\\.\\d+)?%' },
      { token: 'Container Size', pattern: '\\d+(?:\\.\\d+)?(?:ml|cl|L|oz)\\b' },
      { token: 'Container Type', pattern: '\\b(?:Bottle|Can|Keg|Cask|Growler)\\b' },
      { token: 'Currency (ISO 4217)', pattern: '\\b[A-Z]{3}\\b' },
      { token: 'Cost (VAT excluded)', pattern: '@\\d+(?:\\.\\d+)?' },
      { token: 'VAT rate', pattern: 'V\\d+(?:\\.\\d+)?' },
      { token: 'Cost (VAT included)', pattern: '@?\\d+(?:\\.\\d+)?v' },
      { token: 'Stock Amount', pattern: 'x\\d+' },
      { token: 'Retail Price (VAT excluded)', pattern: '/\\d+(?:\\.\\d+)?' },
      { token: 'Retail Price (VAT included)', pattern: '/?\\d+(?:\\.\\d+)?v' },
    ],
    stepsTitle: 'Parsing the compact form',
    parserTitle: 'Reference parser (JavaScript)',
    parserLead:
      'The exact parser that powers the live checker above. It has no dependencies and is safe to copy into a project as a starting point.',
    copyButton: 'Copy code',
    copiedButton: 'Copied',
    selectedButton: 'Selected — press Ctrl+C',
    steps: [
      'Trim the line and skip blanks. One non-empty line is one record.',
      'Consume the leading order number, if present, with the pattern ^\\d+\\.',
      'If a standalone ISO 4217 code (for example THB) appears in the parameter section, record it as the currency for every amount in the record.',
      'Split the head at the first colon. If there is no colon, split at the first comma: before it is the producer, after it is the style.',
      'Inside the head after the colon, split at the last comma: before it is the beverage name, after it is the style. With no comma, the whole head is the beverage name.',
      'Scan the remaining string for parameter tokens using their patterns. Parameter order does not matter.',
      'Normalize container sizes to millilitres for comparison (1 oz = 29.5735 ml), but keep the original unit for display.',
      'Apply the VAT rules and reject records whose stated exclusive and inclusive amounts disagree by more than 0.01.',
    ],
    jsonTitle: 'Canonical JSON mapping',
    jsonCode: `{
  "orderNumber": 2,
  "producerName": "Sample Brewing",
  "beverageName": "Sea Breeze",
  "style": "Pale Ale",
  "abv": 5,
  "containerSize": { "value": 440, "unit": "ml" },
  "containerType": "Can",
  "currency": "THB",
  "costExVat": 180,
  "vatRate": 7.0,
  "costIncVat": 192.6,
  "stockAmount": 8,
  "retailPriceExVat": 320,
  "retailPriceIncVat": 342.4
}`,
    jsonNote:
      'Omit absent fields rather than emitting null. Amounts are JSON numbers, the currency is an ISO 4217 code, and the original container unit is preserved. When currency is omitted, the list’s agreed currency applies.',
  },

  beyond: {
    heading: 'Beyond beer',
    lead: 'BLF stands for Beverage Line Format, and every field works for any packaged drink. Beer is simply one category among many.',
    cards: [
      {
        icon: '🍸',
        title: 'Pre-made cocktails',
        body: 'The same fields describe a canned cocktail. Style carries the product category, and ABV still applies.',
        example: '5. Mock Cocktail Co.: Citrus Club, Pre-made Cocktail 330ml 5%',
      },
      {
        icon: '🍷',
        title: 'Mead, wine & sake',
        body: 'Producer, beverage, style, ABV, container, and price contain nothing beer-specific. Use the appropriate style vocabulary.',
        example: '7. Mock Meadery: Wildflower, Semi-Sweet Mead 12% 375ml Bottle THB @320 x12 / 650',
      },
      {
        icon: '💧',
        title: 'Zero-alcohol',
        body: 'Zero is a valid ABV. Use a style such as Non-Alcoholic, Hop Water, or Soft Drink.',
        example: '8. Mock Brewery: Hop Water, Non-Alcoholic Sparkling 0% 330ml Can THB @28 x24 / 65',
      },
    ],
  },

  roadmap: {
    heading: 'Limitations and the road to v1.1',
    lead: 'A good standard states its own limits. These are the gaps in v1.0 that OpenCraft is considering for the next versions.',
    versionLabel: 'Proposed',
    items: [
      {
        version: 'v1.1',
        title: 'Stable product ID',
        body: 'Order numbers are display indexes. An optional SKU token would let systems match the same product across list updates.',
      },
      {
        version: 'v1.1',
        title: 'List header and metadata',
        body: 'A list-level header could declare the BLF version, default currency, default VAT rate, and effective date once, instead of repeating them in every record.',
      },
      {
        version: 'v1.1',
        title: 'Style registry',
        body: 'Style is free text in v1.0. A shared registry of canonical names would make search and filtering reliable while keeping free text allowed.',
      },
      {
        version: 'v1.1',
        title: 'Escaping and quoting',
        body: 'Names containing token-like fragments, such as a beverage called “440ml”, need an escape hatch. The expanded form is the current workaround.',
      },
      {
        version: 'v1.2',
        title: 'Reference test suite',
        body: 'A public test corpus would ensure that two independent parsers agree on every edge case.',
      },
    ],
  },

  feedback: {
    heading: 'Try it, then tell us what broke',
    body: 'BLF is an open proposal, not a finished industry standard. Implement it, test it with your real lists, and send corrections or edge cases. Real-world examples are the fastest way to make v1.1 better.',
    email: 'hi@opencraft.bar',
    button: 'Send feedback',
    footer: 'BLF v1.0 · Proposed by OpenCraft · 3 November 2026',
  },
};
