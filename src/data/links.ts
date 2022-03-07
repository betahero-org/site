import type { DocsMap } from "$data/docs";

export const links = {
  discord: "betahero",
  twitter: "betahero_org",
  instagram: "betahero_org",
  youtube: "UCNp0v5PZ-mP4Cdogscy6uTA",
  tiktok: "betahero_org",
  facebook: "betaheroes",
  storeId: "9nghp3dx8hdx",
  github: {
    owner: "dww510",
    repo: "betahero-org",
    siteRepo: "site"
  }
};

export type NavbarItem = {
  name: string;
  path: string;
  external?: boolean;
  icon: any;
  type?: string;
  sidebarTree?: DocsMap[];
};
