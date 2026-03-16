// Project data — swap this array with a CMS API call (Sanity, Contentful, etc.) when ready
// preview.frames: add image paths here once screenshots are ready (drop in /public/previews/[slug]/)

const projects = [
  {
    id: '01',
    slug: 'curri',
    title: 'Curri',
    category: 'Product Design',
    tags: ['Product Design', 'Design Systems', 'Mobile', 'B2B'],
    year: '2024',
    description:
      'I spend most of my time at Curri figuring out how to make logistics software feel less like logistics software. That means a lot of research, a lot of simplification, and building a design system the whole team can actually use.',
    type: 'web',
    preview: {
      aspect: '16 / 7',
      frames: [
        // { id: 'overview', label: 'Overview', src: '/previews/curri/overview.webp', alt: 'Curri dispatcher dashboard', caption: 'Dispatcher dashboard — v2' },
        // { id: 'mobile',   label: 'Mobile',   src: '/previews/curri/mobile.webp',   alt: 'Curri driver mobile app',    caption: 'Driver app — route cards' },
        // { id: 'system',   label: 'System',   src: '/previews/curri/system.webp',   alt: 'Curri design system',        caption: 'Component library' },
      ],
    },
  },
  {
    id: '02',
    slug: 'duffl',
    title: 'Duffl',
    category: 'UX Design & Branding',
    tags: ['UX Design', 'Branding', 'User Research'],
    year: '2023',
    description:
      'Duffl was fast-paced and a little chaotic in the best way. I did the full UX redesign and brand refresh — talked to a lot of users, mapped out where things were breaking, and rebuilt the experience from the ground up. Conversion went up 12%.',
    type: 'web',
    preview: {
      aspect: '16 / 7',
      frames: [
        // { id: 'home',    label: 'Home',    src: '/previews/duffl/home.webp',    alt: 'Duffl home screen',    caption: 'Home — redesigned browse' },
        // { id: 'brand',   label: 'Brand',   src: '/previews/duffl/brand.webp',   alt: 'Duffl brand system',   caption: 'Brand refresh' },
      ],
    },
  },
  {
    id: '03',
    slug: 'rummo',
    title: 'Rummo',
    category: 'SaaS Product',
    tags: ['UX Design', 'Task Analysis', 'SaaS'],
    year: '2022',
    description:
      'Fleet management is genuinely complicated. At Rummo I designed the knowledge and program creation flow — the hard part was figuring out how to make something that experts use every day feel intuitive to someone new.',
    type: 'web',
    preview: {
      aspect: '16 / 7',
      frames: [
        // { id: 'flow',    label: 'Flow',    src: '/previews/rummo/flow.webp',    alt: 'Rummo program creation flow', caption: 'Program creation — step 1' },
        // { id: 'details', label: 'Details', src: '/previews/rummo/details.webp', alt: 'Rummo detail view',           caption: 'Knowledge detail view' },
      ],
    },
  },
]

export default projects
