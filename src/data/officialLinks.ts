export type OfficialLinkIcon = 'globe' | 'line' | 'facebook' | 'instagram' | 'map';

export interface OfficialLink {
  key: string;
  href: string;
  icon: OfficialLinkIcon;
  external: boolean;
}

export const officialLinks: OfficialLink[] = [
  { key: 'footer.officialWebsite', href: 'https://opencraft.bar/', icon: 'globe', external: false },
  { key: 'footer.lineOpenChat', href: 'https://line.me/ti/g2/aWvX_UXo5uxnqJVq1Y1jpUwPJw-jBPlPHDez9g', icon: 'line', external: true },
  { key: 'footer.facebookPage', href: 'https://www.facebook.com/opencraft.bar', icon: 'facebook', external: true },
  { key: 'footer.instagram', href: 'https://www.instagram.com/open.craft.bkk', icon: 'instagram', external: true },
];

// Extra links shown only on the /links hub (kept out of the footer)
export const linksPageLinks: OfficialLink[] = [
  ...officialLinks,
  { key: 'linksPage.googleMaps', href: 'https://maps.app.goo.gl/sZHSxx5MDvSbMPNj9', icon: 'map', external: true },
];
