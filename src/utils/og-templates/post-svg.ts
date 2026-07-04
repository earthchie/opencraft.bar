// OG Image Template: Post/Article SVG
// Generates a 1200x630 SVG for knowledge articles and news

import type { OgPalette } from '../og-theme.js';

interface PostSvgOptions {
  title: string;
  author?: string;
  hostname: string;
  palette: OgPalette;
}

// Truncate text to fit within max lines
function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 1).trimEnd() + '…';
}

// Split title into lines for wrapping
function wrapTitle(title: string, maxCharsPerLine: number = 30): string[] {
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, 3);
}

export function generatePostSvg(options: PostSvgOptions): string {
  const { title, author, hostname, palette } = options;
  const truncatedTitle = truncateText(title, 120);
  const titleLines = wrapTitle(truncatedTitle);

  // Calculate title Y position based on line count
  const titleStartY = titleLines.length === 1 ? 320 : titleLines.length === 2 ? 270 : 230;
  const lineHeight = 64;

  // Gradient colors for title
  const gradientId = 'titleGrad';
  const gradStart = palette.accentLight;
  const gradEnd = palette.accent;

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradStart}" />
      <stop offset="100%" stop-color="${gradEnd}" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="${palette.bg}" />

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="4" fill="${palette.accent}" />

  <!-- Left accent line -->
  <rect x="60" y="120" width="4" height="380" rx="2" fill="${palette.accent}" opacity="0.6" />

  // Hostname pill
  <rect x="60" y="50" rx="20" ry="20" width="${hostname.length * 16 + 40}" height="50"
        fill="${palette.pillBg}" stroke="${palette.pillBorder}" stroke-width="1" />
  <text x="${hostname.length * 8 + 80}" y="82" text-anchor="middle"
        font-family="Noto Sans" font-size="22" font-weight="600"
        fill="${palette.textMuted}">${hostname}</text>

  <!-- Title lines with gradient -->
  ${titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${titleStartY + i * lineHeight}" font-family="Noto Sans"
         font-size="60" font-weight="700" fill="url(#${gradientId})">${escapeXml(line)}</text>`
    )
    .join('\n  ')}

  <!-- Author at bottom -->
  ${
    author
      ? `<text x="80" y="570" font-family="Noto Sans" font-size="30" font-weight="600"
         fill="${palette.textMuted}">${escapeXml(author)}</text>`
      : ''
  }

  <!-- Bottom accent bar -->
  <rect x="60" y="600" width="80" height="3" rx="1.5" fill="${palette.accent}" />
</svg>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
