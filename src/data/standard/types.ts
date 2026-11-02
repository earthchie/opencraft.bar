export type TokenKind =
  | 'plain'
  | 'order'
  | 'producer'
  | 'beverage'
  | 'style'
  | 'abv'
  | 'size'
  | 'container'
  | 'currency'
  | 'cost'
  | 'vat'
  | 'costInc'
  | 'stock'
  | 'price'
  | 'priceInc';

export interface AnatomySegment {
  text: string;
  kind: TokenKind;
}

export interface PlaygroundLabels {
  order: string;
  producer: string;
  beverage: string;
  style: string;
  abv: string;
  size: string;
  container: string;
  currency: string;
  costExVat: string;
  costIncVat: string;
  vat: string;
  stock: string;
  retailPriceExVat: string;
  retailPriceIncVat: string;
}

export interface PlaygroundContent {
  label: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  sampleButton: string;
  clearButton: string;
  empty: string;
  statusParsed: string;
  statusWarnings: string;
  statusErrors: string;
  lineLabel: string;
  unknownToken: string;
  vatMismatch: string;
  missingProducer: string;
  labels: PlaygroundLabels;
}

export interface StandardContent {
  meta: {
    title: string;
    description: string;
  };
  playground: PlaygroundContent;
  hero: {
    eyebrow: string;
    title: string;
    acronym: string;
    subtitle: string;
    published: string;
    chips: string[];
  };
  toc: {
    label: string;
    items: { id: string; label: string }[];
  };
  why: {
    heading: string;
    lead: string[];
    principles: { icon: string; title: string; body: string }[];
  };
  anatomy: {
    heading: string;
    lead: string;
    pattern: string;
    patternLabel: string;
    exampleLabel: string;
    exampleSegments: AnatomySegment[];
    tokenHeaders: [string, string, string];
    tokens: { token: string; field: string; note: string }[];
    footnote: string;
  };
  fields: {
    heading: string;
    lead: string;
    headers: [string, string, string, string];
    required: string;
    optional: string;
    rows: { field: string; required: boolean; syntax: string; notes: string }[];
    footnote: string;
  };
  forms: {
    heading: string;
    lead: string;
    compact: {
      title: string;
      body: string;
      code: string;
      notes: string[];
    };
    expanded: {
      title: string;
      body: string;
      code: string;
      notes: string[];
    };
  };
  vat: {
    heading: string;
    lead: string;
    rules: { title: string; body: string }[];
    exampleTitle: string;
    exampleCode: string;
    exampleNote: string;
  };
  examples: {
    heading: string;
    lead: string;
    expandedLabel: string;
    cards: {
      title: string;
      compact: string;
      fields: { key: string; value: string }[];
      note: string;
    }[];
  };
  machine: {
    heading: string;
    lead: string;
    tokenHeaders: [string, string];
    tokenRows: { token: string; pattern: string }[];
    stepsTitle: string;
    steps: string[];
    parserTitle: string;
    parserLead: string;
    copyButton: string;
    copiedButton: string;
    selectedButton: string;
    jsonTitle: string;
    jsonCode: string;
    jsonNote: string;
  };
  beyond: {
    heading: string;
    lead: string;
    cards: { icon: string; title: string; body: string; example: string }[];
  };
  roadmap: {
    heading: string;
    lead: string;
    versionLabel: string;
    items: { version: string; title: string; body: string }[];
  };
  feedback: {
    heading: string;
    body: string;
    email: string;
    button: string;
    footer: string;
  };
}
