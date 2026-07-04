// OG Image Template: Tag Pages
// Satori JSX template for tag page OG images (1200x630)

import type { OgPalette } from '../og-theme.js';

interface TagTemplateProps {
  tagName: string;
  hostname: string;
  palette: OgPalette;
}

export function tagTemplate({ tagName, hostname, palette }: TagTemplateProps) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        width: '1200px',
        height: '630px',
        background: palette.bg,
        padding: '60px',
        position: 'relative' as const,
      },
      children: [
        // Top accent bar
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: palette.accent,
            },
          },
        },
        // Tag title with # prefix
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '32px',
            },
            children: [
              // # faded
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Noto Sans',
                    fontSize: '90px',
                    fontWeight: 300,
                    color: palette.textMuted,
                    opacity: 0.4,
                    marginRight: '8px',
                  },
                  children: '#',
                },
              },
              // Tag name with gradient
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Noto Sans',
                    fontSize: '90px',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${palette.accentLight}, ${palette.accent})`,
                    backgroundClip: 'text',
                    color: 'transparent',
                  },
                  children: tagName,
                },
              },
            ],
          },
        },
        // Separator
        {
          type: 'div',
          props: {
            style: {
              width: '80px',
              height: '3px',
              background: palette.accent,
              borderRadius: '2px',
              marginBottom: '32px',
            },
          },
        },
        // Subtitle
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Noto Sans',
              fontSize: '28px',
              fontWeight: 400,
              color: palette.textMuted,
              lineHeight: 1.5,
              textAlign: 'center' as const,
            },
            children: `Knowledge articles tagged with ${tagName}`,
          },
        },
        // Hostname pill at bottom
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute' as const,
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 24px',
              borderRadius: '20px',
              background: palette.pillBg,
              border: `1px solid ${palette.pillBorder}`,
            },
            children: [
              {
                type: 'span',
                props: {
                  style: {
                    fontFamily: 'Noto Sans',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: palette.textMuted,
                  },
                  children: hostname,
                },
              },
            ],
          },
        },
      ],
    },
  };
}
