// BUBBLEHOPS content & product data.
// Extracted from the design handoff (source/bubblehops-site.dc.html) so the
// live site matches the approved copy, pricing and geometry exactly.

export type BaseTrainer = {
  id: string;
  img: string;
  name: string;
  meta: string;
  price: number;
  panel: keyof typeof PANELS;
  ar: number; // photo aspect ratio (width / height)
  heel: { x: string; y: string };
  box: { left: string; top: string; width: string };
  /** Marked true where the source used a placeholder photo — swap before shipping. */
  placeholderPhoto?: boolean;
};

export const BASES_IN_STOCK: BaseTrainer[] = [
  {
    id: 'lamorra',
    img: '/photos/bubblehops-kappa-la-morra-kids-trainer-base.jpg',
    name: 'Kappa La Morra',
    meta: 'Chunky sole · UK 10 – 6',
    price: 78,
    panel: 'base01',
    ar: 759 / 380,
    heel: { x: '13%', y: '80%' },
    box: { left: '32%', top: '40%', width: '36%' }
  },
  {
    id: 'advantage',
    img: '/photos/bubblehops-adidas-advantage-kids-trainer-base.jpg',
    name: 'Adidas Advantage Base',
    meta: 'Triple velcro · UK 10 – 2',
    price: 80,
    panel: 'base05',
    ar: 900 / 442,
    heel: { x: '13%', y: '74%' },
    box: { left: '32%', top: '42%', width: '36%' }
  },
  {
    id: 'vspace',
    img: '/photos/bubblehops-adidas-vs-pace-kids-trainer-base.jpg',
    name: 'Adidas VS Pace',
    meta: 'Low profile · UK 10 – 6',
    price: 82,
    panel: 'base02',
    ar: 723 / 361,
    heel: { x: '13%', y: '80%' },
    box: { left: '32%', top: '41%', width: '36%' }
  },
  {
    id: 'borough',
    img: '/photos/bubblehops-nike-court-borough-kids-trainer-base.jpg',
    name: 'Nike Court Borough',
    meta: 'Lace-up low · UK 13 – 6',
    price: 88,
    panel: 'base03',
    ar: 328 / 162,
    heel: { x: '13%', y: '79%' },
    box: { left: '33%', top: '40%', width: '34%' }
  },
  {
    id: 'boroughmid',
    img: '/photos/bubblehops-nike-court-borough-mid-2-kids-trainer-base.jpg',
    name: 'Nike Court Borough Mid 2',
    meta: 'Mid top · UK 10 – 6',
    price: 125,
    panel: 'base04',
    ar: 1513 / 954,
    heel: { x: '12%', y: '82%' },
    box: { left: '33%', top: '40%', width: '34%' }
  },
  {
    id: 'airforce',
    img: '/photos/bubblehops-nike-court-borough-kids-trainer-base.jpg',
    name: 'Nike Air Force 1',
    meta: 'Low top · UK 10 – 6',
    price: 135,
    panel: 'base03',
    ar: 328 / 162,
    heel: { x: '13%', y: '79%' },
    box: { left: '33%', top: '40%', width: '34%' },
    placeholderPhoto: true // TODO: swap in the real AF1 product photo before shipping
  }
];

export function getBase(id: string): BaseTrainer | undefined {
  return BASES_IN_STOCK.find((b) => b.id === id);
}

export type WordColour = { id: string; value: string; label: string };

export const WORD_COLOURS: WordColour[] = [
  { id: 'white', value: '#ffffff', label: 'White' },
  { id: 'ink', value: '#201e1d', label: 'Black' },
  { id: 'grey', value: '#9b9797', label: 'Grey' },
  { id: 'lime', value: '#b6ea16', label: 'Lime' },
  { id: 'green', value: '#1f9d55', label: 'Green' },
  { id: 'teal', value: '#12b5b0', label: 'Teal' },
  { id: 'sky', value: '#4aa8ff', label: 'Sky blue' },
  { id: 'blue', value: '#1f4fd8', label: 'Blue' },
  { id: 'purple', value: 'oklch(0.52 0.22 305)', label: 'Purple' },
  { id: 'lilac', value: '#b98cf0', label: 'Lilac' },
  { id: 'magenta', value: '#d81b8c', label: 'Magenta' },
  { id: 'pink', value: '#ff7ab8', label: 'Pink' },
  { id: 'red', value: '#e02a1b', label: 'Red' },
  { id: 'orange', value: '#ff7a1a', label: 'Orange' },
  { id: 'gold', value: '#e8b400', label: 'Gold' },
  { id: 'yellow', value: '#f7e733', label: 'Yellow' },
  { id: 'brown', value: '#7a4a1e', label: 'Brown' },
  { id: 'cream', value: '#f0e3c8', label: 'Cream' }
];

export const SIZES = ['UK 10', 'UK 11', 'UK 12', 'UK 13', 'UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5', 'UK 6'];

// Seed matching source/inventory.js's FALLBACK_STOCK — used whenever Supabase
// isn't configured (see lib/inventory.ts), so the designer/checkout always work.
export const SEED_STOCK: Record<string, Record<string, number>> = {
  lamorra: { 'UK 10': 2, 'UK 11': 3, 'UK 12': 0, 'UK 13': 4, 'UK 1': 2, 'UK 2': 1, 'UK 3': 0, 'UK 4': 3, 'UK 5': 2, 'UK 6': 1 },
  advantage: { 'UK 10': 4, 'UK 11': 2, 'UK 12': 3, 'UK 13': 2, 'UK 1': 5, 'UK 2': 3, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 },
  vspace: { 'UK 10': 1, 'UK 11': 0, 'UK 12': 2, 'UK 13': 3, 'UK 1': 2, 'UK 2': 2, 'UK 3': 1, 'UK 4': 0, 'UK 5': 1, 'UK 6': 2 },
  borough: { 'UK 10': 0, 'UK 11': 0, 'UK 12': 0, 'UK 13': 2, 'UK 1': 3, 'UK 2': 4, 'UK 3': 2, 'UK 4': 2, 'UK 5': 1, 'UK 6': 3 },
  boroughmid: { 'UK 10': 2, 'UK 11': 1, 'UK 12': 1, 'UK 13': 0, 'UK 1': 2, 'UK 2': 2, 'UK 3': 3, 'UK 4': 1, 'UK 5': 0, 'UK 6': 2 },
  airforce: { 'UK 10': 0, 'UK 11': 0, 'UK 12': 0, 'UK 13': 0, 'UK 1': 0, 'UK 2': 0, 'UK 3': 0, 'UK 4': 0, 'UK 5': 0, 'UK 6': 0 }
};

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: 'How much do custom trainers cost?',
    a: "Prices start at £78 for a single hand-painted shoe on a Kappa La Morra base and run to £157 for a full pair on a Nike Court Borough Mid 2. The base trainer is bought new in your child's size and included in that price, as is the painting, sealing and free standard UK delivery. Leaving one shoe blank reduces the total."
  },
  {
    q: 'How are custom trainers made?',
    a: 'Every panel that takes colour is stripped with acetone deglazer first, which is the step most custom pairs skip and the reason they crack. Colour goes on in thin layers of Angelus acrylic leather paint, built up by hand rather than sprayed, then the lettering is outlined and cleaned up. Two coats of acrylic finisher seal the pair, and it cures fully before it is boxed.'
  },
  {
    q: 'How to look after hand-painted trainers',
    a: 'Wipe them with a damp cloth, mild soap and light pressure. Never put painted trainers through a washing machine, however muddy they get. Dry them at room temperature stuffed with paper, away from radiators, because heat lifts the finish. Keep acetone, alcohol wipes and magic erasers away from the paint, as those are designed to remove exactly this kind of coating.'
  },
  {
    q: 'Can I send you my own design?',
    a: "Yes. The online designer covers names, lettering colours and bubble stickers, but if you have a drawing, a character, a logo or a photo in mind, send it over on the contact page and we'll quote for it. Hand-drawn artwork from the child themselves is the one we most enjoy painting."
  },
  {
    q: 'Best trainers to customise',
    a: "Smooth leather uppers take paint best, which is why our base range is built around them. The Adidas Advantage and VS Pace are the most forgiving and the cheapest to start with; the Nike Court Borough gives you a bigger side panel for longer names; the Court Borough Mid 2 adds the ankle panel for more artwork. Canvas and knit trainers absorb paint unevenly and we don't recommend them."
  },
  {
    q: 'How long do custom trainers take to make?',
    a: 'Usually about three days from the date of order, plus two to three days for delivery. Next-day delivery is available at checkout if you need them sooner. You get a photo of the finished pair before it ships and 24 hours to comment.'
  },
  {
    q: 'Can I send these as a gift?',
    a: "Yes. Add a gift note at checkout and we'll write it into the box, leave the invoice out, and ship straight to the recipient's address. If it's for a birthday, tell us the date on the contact form and we'll work back from it."
  }
];

export const CARE_STEPS = [
  {
    n: '01',
    title: 'Strip and prep',
    body: 'Every panel that takes colour is stripped with acetone deglazer first — the step most custom pairs skip, and the reason they crack.'
  },
  {
    n: '02',
    title: 'Paint by hand',
    body: 'Colour goes on in thin layers of Angelus acrylic leather paint, built up by hand rather than sprayed, then the lettering is outlined and cleaned up.'
  },
  {
    n: '03',
    title: 'Seal and cure',
    body: 'Two coats of acrylic finisher seal the pair, and it cures fully before it is boxed and photographed for you to approve.'
  }
];

export const SITE = {
  name: 'BUBBLEHOPS',
  email: 'studio@bubblehops.com',
  instagramHandle: '@bubblehop_uk',
  instagramUrl: 'https://instagram.com/bubblehop_uk',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bubblehops.co.uk'
};

export type RouteMeta = { path: string; title: string; desc: string; crumb: string };

export const ROUTES: Record<string, RouteMeta> = {
  home: { path: '/', title: "BUBBLEHOPS | Hand-Painted Custom Kids' Trainers, Made in the UK", desc: "Design hand-painted custom kids' trainers online. Pick a base, add their name in graffiti lettering, and we paint it by hand in the UK. From £78, free UK delivery.", crumb: 'Home' },
  design: { path: '/create-your-own', title: "Create Your Own Custom Kids' Trainers | BUBBLEHOPS", desc: "Design custom kids' trainers in your browser: pick a base, type their name, choose colours and bubble stickers, then we hand-paint the pair in the UK.", crumb: 'Create your own' },
  shop: { path: '/base-trainers', title: 'Base Trainers for Customising | BUBBLEHOPS', desc: "Every base trainer we hand-paint: Kappa La Morra, Adidas Advantage, Adidas VS Pace, Nike Court Borough and Court Borough Mid 2. UK kids' sizes 10 to 6.", crumb: 'Base trainers' },
  gallery: { path: '/gallery', title: 'Custom Trainer Gallery | Hand-Painted Pairs | BUBBLEHOPS', desc: "Hand-painted kids' trainers we have made: names, characters and graffiti lettering. Every pair is one of a kind.", crumb: 'Gallery' },
  about: { path: '/about', title: 'About BUBBLEHOPS | Hand-Painted Trainers Since 2006', desc: "BUBBLEHOPS began in 2006 with a single pair of hand-painted Stan Smiths. Today we work to custom order, painting one-of-a-kind kids' trainers by hand.", crumb: 'About' },
  faq: { path: '/sizing-and-care', title: 'Sizing, Care and FAQs | Custom Trainers | BUBBLEHOPS', desc: "UK kids' sizing, how long custom trainers take, how they are made, and how to look after hand-painted trainers.", crumb: 'Sizing & care' },
  contact: { path: '/contact', title: 'Contact BUBBLEHOPS | Custom Trainer Studio', desc: 'Talk to the studio about a custom pair, an existing order or press. Email studio@bubblehops.com, replies within one working day.', crumb: 'Contact' },
  terms: { path: '/terms-and-conditions', title: 'Terms & Conditions | BUBBLEHOPS', desc: 'Terms for ordering hand-painted custom trainers from BUBBLEHOPS, including artwork sign-off and our returns policy.', crumb: 'Terms & conditions' },
  basket: { path: '/basket', title: 'Your basket | BUBBLEHOPS', desc: 'Review the pairs in your basket before checkout.', crumb: 'Basket' },
  checkout: { path: '/checkout', title: 'Checkout | BUBBLEHOPS', desc: 'Choose sizes, delivery and payment for your hand-painted custom trainers.', crumb: 'Checkout' },
  account: { path: '/account', title: 'My account | BUBBLEHOPS', desc: 'Your BUBBLEHOPS orders and saved designs.', crumb: 'Account' },
  signIn: { path: '/sign-in', title: 'Sign in | BUBBLEHOPS', desc: 'Sign in to save designs to your account and track orders.', crumb: 'Sign in' }
};

// Hero carousel — real customer photos, per-slide focal position for cover-fit framing.
export const HERO_SLIDES = [
  { img: '/photos/bubblehops-custom-kids-trainers-hero.jpg', pos: '50% 40%' },
  { img: '/photos/bubblehops-hand-painted-custom-kids-trainers-01.jpg', pos: '50% 35%' },
  { img: '/photos/bubblehops-hand-painted-kids-trainers-connor.jpg', pos: '50% 30%' },
  { img: '/photos/bubblehops-hand-painted-stan-smith-kids-trainers-tomski.jpg', pos: '50% 35%' },
  { img: '/photos/bubblehops-hand-painted-velcro-kids-trainers-anna.jpg', pos: '50% 40%' }
];

export const GALLERY_IMAGES = [
  '/photos/bubblehops-hand-painted-custom-kids-trainers-01.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-02.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-03.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-04.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-05.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-06.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-07.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-08.jpg',
  '/photos/bubblehops-hand-painted-custom-kids-trainers-09.jpg',
  '/photos/bubblehops-hand-painted-kids-trainers-connor.jpg',
  '/photos/bubblehops-hand-painted-stan-smith-kids-trainers-tomski.jpg',
  '/photos/bubblehops-hand-painted-velcro-kids-trainers-anna.jpg',
  '/photos/01.jpg', '/photos/02.jpg', '/photos/03.jpg', '/photos/04.jpg',
  '/photos/05.jpg', '/photos/06.jpg', '/photos/07.jpg', '/photos/08.jpg', '/photos/09.jpg'
];

export const INSTAGRAM_STRIP = [
  '/photos/01.jpg', '/photos/02.jpg', '/photos/03.jpg', '/photos/04.jpg',
  '/photos/05.jpg', '/photos/06.jpg', '/photos/07.jpg', '/photos/08.jpg', '/photos/09.jpg'
];

export const ABOUT_USES = [
  { label: 'Paint', body: 'Angelus acrylic leather paint, thinned and built in layers. Non-toxic once cured, and it flexes with the leather instead of sitting on top of it.' },
  { label: 'Prep', body: 'Every panel that takes colour is stripped with acetone deglazer first — the step most custom pairs skip, and the reason they crack.' },
  { label: 'Finish', body: 'Two coats of acrylic finisher seal the pair, so the artwork survives play, weather and the school run.' }
];
// Auto-derived from the BUBBLEHOPS design prototype (source/bubblehops-site.dc.html).
// PANELS: per-base hand-sampled paintable side-panel silhouette (SVG path, 0-100 viewBox).
// SOLE_CLIP: per-base clip-path polygon so lettering tucks behind the midsole curve.
// These are photo-derived geometry, not generic shapes — re-derive them if base photography changes.
export const PANELS: Record<string, string> = {
  "base01": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,94.7 L 93.6,94.8 L 91.5,94.9 L 89.3,95.2 L 87.1,95.5 L 84.9,95.8 L 82.7,96 L 80.5,96.2 L 78.4,96.4 L 76.2,96.5 L 74,96.7 L 71.8,96.8 L 69.6,96.8 L 67.5,96.9 L 65.3,96.9 L 63.1,96.8 L 60.9,96.6 L 58.7,96.4 L 56.5,96.2 L 54.4,96 L 52.2,95.8 L 50,95.6 L 47.8,95.4 L 45.6,95.2 L 43.5,95.1 L 41.3,95 L 39.1,94.9 L 36.9,94.8 L 34.7,94.9 L 32.5,94.9 L 30.4,95 L 28.2,95 L 26,94.9 L 23.8,94.9 L 21.6,94.7 L 19.5,94.4 L 17.3,94 L 15.1,93.7 L 12.9,93.1 L 10.7,92.6 L 8.5,91.8 L 6.4,91.5 L 4.2,91.2 Z",
  "base02": "M 6.4,28.6 L 8.5,27.8 L 10.7,27.8 L 12.9,28.4 L 15.1,28.8 L 17.3,30.5 L 19.5,32.6 L 21.6,34.4 L 23.8,35.5 L 26,35.9 L 28.2,35.4 L 30.4,31.5 L 32.5,26.3 L 34.7,21.1 L 36.9,16.9 L 39.1,13.5 L 41.3,13.8 L 43.5,15.7 L 45.6,18 L 47.8,20.2 L 50,22.7 L 52.2,24.8 L 54.4,27.1 L 56.5,29.6 L 58.7,31.6 L 60.9,33.4 L 63.1,35.7 L 65.3,37.9 L 67.5,39.9 L 69.6,42.1 L 71.8,44.4 L 74,46.3 L 76.2,48.2 L 78.4,49.7 L 80.5,51.3 L 82.7,52.4 L 84.9,53.5 L 87.1,54.5 L 89.3,55.9 L 91.5,57.6 L 93.6,58.4 L 95.8,59.4 L 95.8,87.9 L 93.6,88.6 L 91.5,89.3 L 89.3,90.6 L 87.1,91.8 L 84.9,92.8 L 82.7,93.7 L 80.5,94.6 L 78.4,95.2 L 76.2,95.9 L 74,96.3 L 71.8,96.7 L 69.6,96.9 L 67.5,97.1 L 65.3,97 L 63.1,96.9 L 60.9,96.7 L 58.7,96.4 L 56.5,96.1 L 54.4,95.8 L 52.2,95.4 L 50,95 L 47.8,94.7 L 45.6,94.4 L 43.5,94.2 L 41.3,94 L 39.1,94 L 36.9,94.2 L 34.7,94.3 L 32.5,94.7 L 30.4,94.9 L 28.2,95.1 L 26,95 L 23.8,95 L 21.6,94.8 L 19.5,94.6 L 17.3,94.3 L 15.1,93.9 L 12.9,93.3 L 10.7,92.4 L 8.5,92 L 6.4,91.5 Z",
  "base03": "M 4.2,23.9 L 6.4,24 L 8.5,25.4 L 10.7,29.8 L 12.9,32.9 L 15.1,36.8 L 17.3,40 L 19.5,41.2 L 21.6,36.7 L 23.8,29.8 L 26,23.5 L 28.2,18 L 30.4,14.4 L 32.5,14.5 L 34.7,16.2 L 36.9,18.2 L 39.1,20.3 L 41.3,22.1 L 43.5,24 L 45.6,25.7 L 47.8,28 L 50,30 L 52.2,31.5 L 54.4,33.3 L 56.5,35.4 L 58.7,37.2 L 60.9,38.9 L 63.1,40.6 L 65.3,42.5 L 67.5,43.9 L 69.6,45.3 L 71.8,46.9 L 74,48.4 L 76.2,50 L 78.4,51.3 L 80.5,52.5 L 82.7,53.3 L 84.9,54.1 L 87.1,54.4 L 89.3,55.5 L 91.5,57.8 L 93.6,58.7 L 95.8,59.7 L 95.8,92.7 L 93.6,93.7 L 91.5,94.4 L 89.3,96.8 L 87.1,96.8 L 84.9,96.9 L 82.7,97 L 80.5,97.1 L 78.4,97.2 L 76.2,97.2 L 74,97.2 L 71.8,97.1 L 69.6,97 L 67.5,97 L 65.3,96.9 L 63.1,96.8 L 60.9,96.8 L 58.7,96.7 L 56.5,96.6 L 54.4,96.5 L 52.2,96.5 L 50,96.4 L 47.8,96.3 L 45.6,96.2 L 43.5,96.1 L 41.3,96.1 L 39.1,96 L 36.9,95.9 L 34.7,95.8 L 32.5,95.7 L 30.4,95.6 L 28.2,95.7 L 26,95.8 L 23.8,95.9 L 21.6,96.1 L 19.5,96.3 L 17.3,96.2 L 15.1,96.1 L 12.9,95.9 L 10.7,95.7 L 8.5,95.3 L 6.4,95.1 L 4.2,95 Z",
  "base04": "M 4.2,34 L 6.4,33.6 L 8.5,33.1 L 10.7,33.6 L 12.9,30.6 L 15.1,28.9 L 17.3,26.9 L 19.5,24.5 L 21.6,22 L 23.8,19.3 L 26,16.9 L 28.2,14.4 L 30.4,13.4 L 32.5,13.6 L 34.7,14.9 L 36.9,17.2 L 39.1,21.3 L 41.3,26.8 L 43.5,31.5 L 45.6,36.5 L 47.8,41 L 50,44.1 L 52.2,45.5 L 54.4,47.3 L 56.5,48.9 L 58.7,49.7 L 60.9,51.4 L 63.1,53 L 65.3,54.4 L 67.5,55.8 L 69.6,57.3 L 71.8,60.7 L 74,61.8 L 76.2,64.3 L 78.4,66.1 L 80.5,67.9 L 82.7,67 L 84.9,67.9 L 87.1,67.1 L 89.3,66.8 L 91.5,67.9 L 93.6,68 L 95.8,68.5 L 95.8,95.6 L 93.6,95.8 L 91.5,95.9 L 89.3,96.1 L 87.1,96.5 L 84.9,96.8 L 82.7,96.9 L 80.5,97.1 L 78.4,97.1 L 76.2,97.3 L 74,97.3 L 71.8,97.4 L 69.6,97.4 L 67.5,97.5 L 65.3,97.5 L 63.1,97.5 L 60.9,97.5 L 58.7,97.4 L 56.5,97.4 L 54.4,97.4 L 52.2,97.3 L 50,97.3 L 47.8,97.1 L 45.6,96.9 L 43.5,96.6 L 41.3,96.5 L 39.1,96.1 L 36.9,96.1 L 34.7,96 L 32.5,95.9 L 30.4,95.9 L 28.2,96 L 26,96.1 L 23.8,96.1 L 21.6,96.3 L 19.5,96.4 L 17.3,96.5 L 15.1,96.6 L 12.9,96.6 L 10.7,96.6 L 8.5,96.5 L 6.4,96.5 L 4.2,96.4 Z",
  "base05": "M 15.1,36 L 17.3,34.8 L 19.5,35.1 L 21.6,33.4 L 23.8,34.7 L 26,36.9 L 28.2,38.5 L 30.4,38.7 L 32.5,35.5 L 34.7,30.8 L 36.9,24.8 L 39.1,19.3 L 41.3,14.6 L 43.5,13.5 L 45.6,14.5 L 47.8,17.6 L 50,21 L 52.2,24.5 L 54.4,27.9 L 56.5,31.2 L 58.7,33.7 L 60.9,36.4 L 63.1,38.6 L 65.3,40.6 L 67.5,42.4 L 69.6,44.6 L 71.8,46.4 L 74,48.5 L 76.2,50.7 L 78.4,52.6 L 80.5,54.3 L 82.7,55.9 L 84.9,57.2 L 87.1,58.5 L 89.3,59.9 L 91.5,61.9 L 93.6,62.8 L 95.8,63.8 L 95.8,90.9 L 93.6,91.8 L 91.5,92.6 L 89.3,94.5 L 87.1,95.3 L 84.9,95.9 L 82.7,96.3 L 80.5,96.6 L 78.4,96.8 L 76.2,97 L 74,97.1 L 71.8,97.1 L 69.6,97 L 67.5,96.9 L 65.3,96.8 L 63.1,96.6 L 60.9,96.4 L 58.7,96.2 L 56.5,96 L 54.4,95.8 L 52.2,95.5 L 50,95.2 L 47.8,95 L 45.6,94.8 L 43.5,94.6 L 41.3,94.5 L 39.1,94.7 L 36.9,94.8 L 34.7,95 L 32.5,95.2 L 30.4,95.3 L 28.2,95.2 L 26,95 L 23.8,94.7 L 21.6,94.5 L 19.5,94.2 L 17.3,94 L 15.1,93.9 Z"
};

export const SOLE_CLIP: Record<string, string> = {
  "base01": "polygon(100.0% 84.3%,95.0% 83.6%,92.7% 83.4%,90.5% 83.0%,88.3% 82.8%,86.0% 82.5%,83.8% 82.3%,81.5% 81.8%,79.3% 81.3%,77.0% 80.8%,74.8% 80.3%,72.6% 79.3%,70.2% 78.0%,67.9% 76.3%,65.7% 73.9%,63.5% 71.3%,61.2% 68.9%,59.0% 66.8%,56.7% 65.1%,54.5% 63.9%,52.2% 62.2%,50.0% 60.5%,47.8% 58.7%,45.5% 57.1%,43.3% 55.6%,41.0% 54.9%,38.8% 54.3%,36.5% 53.9%,34.3% 53.7%,32.1% 53.4%,29.8% 53.2%,27.4% 52.8%,25.2% 52.5%,23.0% 52.0%,20.7% 51.5%,18.5% 50.5%,16.2% 49.5%,14.0% 48.4%,11.7% 47.5%,9.5% 46.5%,7.3% 46.0%,5.0% 45.6%,0.0% 45.0%,0.0% 112.0%,100.0% 112.0%)",
  "base02": "polygon(100.0% 68.7%,95.0% 68.0%,92.8% 68.0%,90.4% 67.8%,88.2% 67.9%,86.0% 68.3%,83.8% 68.7%,81.4% 69.1%,79.2% 69.7%,77.0% 70.2%,74.8% 70.5%,72.4% 70.7%,70.2% 70.8%,68.0% 70.8%,65.8% 70.7%,63.4% 70.4%,61.2% 70.2%,59.0% 69.8%,56.8% 69.5%,54.4% 69.2%,52.2% 68.9%,50.0% 68.7%,47.8% 68.4%,45.6% 68.1%,43.2% 67.8%,41.0% 67.5%,38.8% 67.3%,36.6% 67.1%,34.2% 66.8%,32.0% 66.6%,29.8% 66.4%,27.6% 66.1%,25.2% 65.8%,23.0% 65.1%,20.8% 63.9%,18.6% 62.3%,16.2% 60.5%,14.0% 58.7%,11.8% 57.0%,9.6% 56.1%,7.2% 55.4%,0.0% 54.5%,0.0% 112.0%,100.0% 112.0%)",
  "base03": "polygon(100.0% 85.1%,95.1% 84.5%,92.7% 84.2%,90.5% 83.8%,88.4% 83.5%,85.9% 83.2%,83.8% 83.1%,81.7% 83.0%,79.2% 83.0%,77.1% 82.9%,74.6% 82.9%,72.5% 82.7%,70.3% 82.4%,67.9% 82.1%,65.7% 81.8%,63.6% 81.3%,61.2% 80.2%,59.0% 78.6%,56.9% 76.5%,54.4% 73.6%,52.3% 70.9%,50.2% 68.6%,47.7% 66.7%,45.6% 65.4%,43.1% 64.7%,41.0% 64.2%,38.8% 63.6%,36.4% 63.0%,34.3% 62.5%,32.1% 62.0%,29.7% 61.6%,27.5% 61.4%,25.4% 61.3%,22.9% 61.3%,20.8% 61.2%,18.3% 61.0%,16.2% 59.9%,14.1% 58.7%,11.6% 57.5%,9.5% 56.1%,7.3% 54.9%,4.9% 54.3%,0.0% 53.7%,0.0% 112.0%,100.0% 112.0%)",
  "base04": "polygon(100.0% 85.3%,95.0% 84.6%,92.8% 84.5%,90.5% 84.2%,88.2% 84.0%,86.0% 83.9%,83.8% 83.8%,81.5% 83.8%,79.2% 83.8%,77.0% 83.7%,74.7% 83.6%,72.5% 83.1%,70.3% 82.3%,68.0% 81.1%,65.7% 79.6%,63.5% 77.7%,61.3% 75.9%,59.0% 74.3%,56.7% 73.2%,54.5% 72.4%,52.3% 71.9%,50.1% 71.5%,47.7% 71.1%,45.5% 70.7%,43.3% 70.2%,41.0% 69.8%,38.7% 69.3%,36.5% 68.8%,34.3% 68.4%,32.0% 68.0%,29.7% 67.5%,27.5% 67.1%,25.3% 66.7%,23.0% 66.2%,20.8% 65.8%,18.5% 65.4%,16.2% 65.1%,14.0% 64.7%,11.8% 64.4%,9.5% 64.1%,7.2% 63.8%,5.0% 63.6%,0.0% 62.9%,0.0% 112.0%,100.0% 112.0%)",
  "base05": "polygon(100.0% 81.0%,95.0% 80.3%,92.8% 80.6%,90.5% 80.8%,88.2% 81.4%,86.0% 82.0%,83.8% 82.6%,81.5% 83.0%,79.2% 83.1%,77.0% 83.0%,74.7% 82.6%,72.5% 81.8%,70.3% 80.9%,68.0% 79.9%,65.7% 78.9%,63.5% 78.3%,61.3% 77.7%,59.0% 77.2%,56.7% 76.7%,54.5% 76.3%,52.3% 75.8%,50.1% 75.6%,47.7% 75.4%,45.5% 75.4%,43.3% 75.3%,41.0% 75.3%,38.7% 75.1%,36.5% 74.9%,34.3% 74.7%,32.0% 74.3%,29.7% 73.9%,27.5% 73.5%,25.3% 73.0%,23.0% 72.7%,20.8% 72.4%,18.5% 71.7%,16.2% 71.4%,14.0% 71.0%,0.0% 69.2%,0.0% 112.0%,100.0% 112.0%)"
};

export const SOLE_ABOVE_CLIP: Record<string, string> = {
  "base01": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 84.3%,95.0% 83.6%,92.7% 83.4%,90.5% 83.0%,88.3% 82.8%,86.0% 82.5%,83.8% 82.3%,81.5% 81.8%,79.3% 81.3%,77.0% 80.8%,74.8% 80.3%,72.6% 79.3%,70.2% 78.0%,67.9% 76.3%,65.7% 73.9%,63.5% 71.3%,61.2% 68.9%,59.0% 66.8%,56.7% 65.1%,54.5% 63.9%,52.2% 62.2%,50.0% 60.5%,47.8% 58.7%,45.5% 57.1%,43.3% 55.6%,41.0% 54.9%,38.8% 54.3%,36.5% 53.9%,34.3% 53.7%,32.1% 53.4%,29.8% 53.2%,27.4% 52.8%,25.2% 52.5%,23.0% 52.0%,20.7% 51.5%,18.5% 50.5%,16.2% 49.5%,14.0% 48.4%,11.7% 47.5%,9.5% 46.5%,7.3% 46.0%,5.0% 45.6%,0.0% 45.0%)",
  "base02": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 68.7%,95.0% 68.0%,92.8% 68.0%,90.4% 67.8%,88.2% 67.9%,86.0% 68.3%,83.8% 68.7%,81.4% 69.1%,79.2% 69.7%,77.0% 70.2%,74.8% 70.5%,72.4% 70.7%,70.2% 70.8%,68.0% 70.8%,65.8% 70.7%,63.4% 70.4%,61.2% 70.2%,59.0% 69.8%,56.8% 69.5%,54.4% 69.2%,52.2% 68.9%,50.0% 68.7%,47.8% 68.4%,45.6% 68.1%,43.2% 67.8%,41.0% 67.5%,38.8% 67.3%,36.6% 67.1%,34.2% 66.8%,32.0% 66.6%,29.8% 66.4%,27.6% 66.1%,25.2% 65.8%,23.0% 65.1%,20.8% 63.9%,18.6% 62.3%,16.2% 60.5%,14.0% 58.7%,11.8% 57.0%,9.6% 56.1%,7.2% 55.4%,0.0% 54.5%)",
  "base03": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 85.1%,95.1% 84.5%,92.7% 84.2%,90.5% 83.8%,88.4% 83.5%,85.9% 83.2%,83.8% 83.1%,81.7% 83.0%,79.2% 83.0%,77.1% 82.9%,74.6% 82.9%,72.5% 82.7%,70.3% 82.4%,67.9% 82.1%,65.7% 81.8%,63.6% 81.3%,61.2% 80.2%,59.0% 78.6%,56.9% 76.5%,54.4% 73.6%,52.3% 70.9%,50.2% 68.6%,47.7% 66.7%,45.6% 65.4%,43.1% 64.7%,41.0% 64.2%,38.8% 63.6%,36.4% 63.0%,34.3% 62.5%,32.1% 62.0%,29.7% 61.6%,27.5% 61.4%,25.4% 61.3%,22.9% 61.3%,20.8% 61.2%,18.3% 61.0%,16.2% 59.9%,14.1% 58.7%,11.6% 57.5%,9.5% 56.1%,7.3% 54.9%,4.9% 54.3%,0.0% 53.7%)",
  "base04": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 85.3%,95.0% 84.6%,92.8% 84.5%,90.5% 84.2%,88.2% 84.0%,86.0% 83.9%,83.8% 83.8%,81.5% 83.8%,79.2% 83.8%,77.0% 83.7%,74.7% 83.6%,72.5% 83.1%,70.3% 82.3%,68.0% 81.1%,65.7% 79.6%,63.5% 77.7%,61.3% 75.9%,59.0% 74.3%,56.7% 73.2%,54.5% 72.4%,52.3% 71.9%,50.1% 71.5%,47.7% 71.1%,45.5% 70.7%,43.3% 70.2%,41.0% 69.8%,38.7% 69.3%,36.5% 68.8%,34.3% 68.4%,32.0% 68.0%,29.7% 67.5%,27.5% 67.1%,25.3% 66.7%,23.0% 66.2%,20.8% 65.8%,18.5% 65.4%,16.2% 65.1%,14.0% 64.7%,11.8% 64.4%,9.5% 64.1%,7.2% 63.8%,5.0% 63.6%,0.0% 62.9%)",
  "base05": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 81.0%,95.0% 80.3%,92.8% 80.6%,90.5% 80.8%,88.2% 81.4%,86.0% 82.0%,83.8% 82.6%,81.5% 83.0%,79.2% 83.1%,77.0% 83.0%,74.7% 82.6%,72.5% 81.8%,70.3% 80.9%,68.0% 79.9%,65.7% 78.9%,63.5% 78.3%,61.3% 77.7%,59.0% 77.2%,56.7% 76.7%,54.5% 76.3%,52.3% 75.8%,50.1% 75.6%,47.7% 75.4%,45.5% 75.4%,43.3% 75.3%,41.0% 75.3%,38.7% 75.1%,36.5% 74.9%,34.3% 74.7%,32.0% 74.3%,29.7% 73.9%,27.5% 73.5%,25.3% 73.0%,23.0% 72.7%,20.8% 72.4%,18.5% 71.7%,16.2% 71.4%,14.0% 71.0%,0.0% 69.2%)"
};
