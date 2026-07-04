import mermaid from 'mermaid';

function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      primaryColor: '#c8934f',
      primaryTextColor: '#e0e0e0',
      primaryBorderColor: '#c8934f',
      lineColor: '#a67a3a',
      secondaryColor: '#1a1a1a',
      tertiaryColor: '#141414',
      fontFamily: "'Inter', 'Noto Sans Thai', system-ui, sans-serif",
      fontSize: '14px',
    },
  });

  // Astro wraps code blocks in <pre class="astro-code" data-language="mermaid">
  const preBlocks = document.querySelectorAll('pre[data-language="mermaid"]');
  if (preBlocks.length === 0) return;

  const replacements: { pre: HTMLElement; container: HTMLDivElement }[] = [];

  preBlocks.forEach((pre, index) => {
    const code = pre.querySelector('code');
    const text = code?.textContent || pre.textContent || '';

    const container = document.createElement('div');
    container.className = 'mermaid';
    container.id = `mermaid-${index}`;
    container.textContent = text;
    pre.style.display = 'none';
    pre.parentElement?.insertBefore(container, pre);
    replacements.push({ pre: pre as HTMLElement, container });
  });

  mermaid.run({ querySelector: '.mermaid' }).then(() => {
    replacements.forEach(({ pre }) => pre.remove());
  }).catch(() => {
    // If mermaid fails, show the code blocks again
    replacements.forEach(({ pre }) => {
      pre.style.display = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', initMermaid);
document.addEventListener('astro:page-load', initMermaid);
