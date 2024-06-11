export function getMobileMainNav(
  accountName: string
): { title: string; href: string }[] {
  return [
    // {
    //   title: 'Overview',
    //   href: `/`,
    // },
    {
      title: 'Jobs',
      href: `/dashboard/${accountName}/jobs`,
    },
    {
      title: 'Runs',
      href: `/dashboard/${accountName}/runs`,
    },
    {
      title: 'Transformers',
      href: `/dashboard/${accountName}/transformers`,
    },
    {
      title: 'Connections',
      href: `/dashboard/${accountName}/connections`,
    },
    {
      title: 'Settings',
      href: `/dashboard/${accountName}/settings`,
    },
  ];
}
