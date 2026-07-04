// OG Image Template: Homepage
// Satori JSX template for the main site OG image (1200x630)

import type { OgPalette } from '../og-theme.js';

interface SiteTemplateProps {
  hostname: string;
  palette: OgPalette;
}

export function siteTemplate({ hostname, palette }: SiteTemplateProps) {
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
        // Hero text
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Noto Sans',
              fontSize: '120px',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${palette.accentLight}, ${palette.accent})`,
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
              marginBottom: '32px',
              letterSpacing: '-1px',
            },
            children: 'OpenCraft',
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
        // Description
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Noto Sans',
              fontSize: '30px',
              fontWeight: 400,
              color: palette.textMuted,
              lineHeight: 1.5,
              textAlign: 'center' as const,
              maxWidth: '700px',
            },
            children: 'Where Craft Meets Open Culture',
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
