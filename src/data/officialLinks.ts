export type OfficialLinkIcon = 'globe' | 'line' | 'facebook' | 'instagram';

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
