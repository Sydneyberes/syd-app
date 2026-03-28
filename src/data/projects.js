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
      aspect: '16 / 10',
      embed: 'https://format-dot-66000807.figma.site',
      bgImage: '/previews/curri/previewbg.jpg',
    },
  },
  {
    id: '02',
    slug: 'curri-ui3',
    title: 'Curri UI3',
    category: 'Design Systems',
    tags: ['Design Systems', 'Component Library', 'B2B'],
    year: '2024',
    description:
      'Building a design system from the ground up for a fast-moving logistics platform. UI3 gave the whole team a shared language — consistent components, clear tokens, and a foundation that could scale.',
    type: 'web',
    preview: {
      aspect: '16 / 7',
      bgImage: '/previews/curri%20ui3/bgrummo1.jpg',
      frames: [],
    },
  },
  {
    id: '03',
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
      bgImage: '/previews/duffl/bgduffle.jpg',
      frames: [],
    },
  },
]

export default projects
