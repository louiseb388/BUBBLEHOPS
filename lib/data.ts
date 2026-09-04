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
    meta: 'Chunky sole · UK kids’ 10 – 6',
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
    meta: 'Triple velcro · UK kids’ 10 – 2',
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
    meta: 'Low profile · UK kids’ 10 – 6',
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
    meta: 'Lace-up low · UK kids’ 13 – 6',
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
    meta: 'Mid top · UK kids’ 10 – 6',
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
    meta: 'High top · UK kids’ 10 – 6',
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
  { id: 'grey', value: '#c0c0c0', label: 'Silver' },
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
  { id: 'brown', value: '#7a4a1e', label: 'Brown' }
];

/** Gloss gradient for the two metallic colours — used both for the picker swatch
 * and, via background-clip:text, for the painted word's fill on the shoe itself. */
export const METALLIC_SWATCH_GRADIENT: Record<string, string> = {
  grey: 'linear-gradient(135deg, #d8d8d8 0%, #f8f8f8 30%, #8a8a8a 55%, #e8e8e8 80%, #b0b0b0 100%)',
  gold: 'linear-gradient(135deg, #d4af37 0%, #fbf3b9 30%, #a4780a 55%, #f3d675 80%, #b8860b 100%)'
};

/** A stroke can't take a CSS gradient, so the metallic outline is faked with a darker
 * base tone plus a thinner lighter tone layered on top, reading as a subtle bevel. */
export const METALLIC_STROKE_TONES: Record<string, { base: string; highlight: string }> = {
  grey: { base: '#9a9a9a', highlight: '#f2f2f2' },
  gold: { base: '#a4780a', highlight: '#f6e27a' }
};

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
  },
  {
    q: 'Do you do adult shoe sizes?',
    a: "Yes we do — get in touch to speak with us directly."
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
  '/photos/02.jpg', '/photos/03.jpg', '/photos/04.jpg',
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
  "base01": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,75.5 L 93.6,75.5 L 91.5,75.5 L 89.3,75.6 L 87.1,75.7 L 84.9,75.8 L 82.7,76 L 80.5,76.2 L 78.4,76.5 L 76.2,76.8 L 74,77.1 L 71.8,77.4 L 69.6,77.7 L 67.5,77.9 L 65.3,78.1 L 63.1,78.2 L 60.9,78.2 L 58.7,78 L 56.5,77.8 L 54.4,77.6 L 52.2,77.2 L 50,76.8 L 47.8,76.3 L 45.6,75.7 L 43.5,75.2 L 41.3,74.6 L 39.1,73.9 L 36.9,73.3 L 34.7,72.7 L 32.5,72.1 L 30.4,71.6 L 28.2,71 L 26,70.5 L 23.8,70.1 L 21.6,69.6 L 19.5,69.3 L 17.3,69 L 15.1,68.8 L 12.9,68.6 L 10.7,68.4 L 8.5,68.4 L 6.4,68.3 L 4.2,68.3 Z",
  "base02": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,74 L 93.6,74.1 L 91.5,74.2 L 89.3,74.4 L 87.1,74.7 L 84.9,75 L 82.7,75.3 L 80.5,75.7 L 78.4,76 L 76.2,76.3 L 74,76.6 L 71.8,76.8 L 69.6,77.4 L 67.5,78.2 L 65.3,79.5 L 63.1,81.1 L 60.9,82.8 L 58.7,84.6 L 56.5,86.3 L 54.4,88 L 52.2,89.6 L 50,90.9 L 47.8,91.7 L 45.6,92.2 L 43.5,92.3 L 41.3,92.3 L 39.1,92.2 L 36.9,92.2 L 34.7,92.1 L 32.5,92.1 L 30.4,92.1 L 28.2,92 L 26,92 L 23.8,91.9 L 21.6,91.8 L 19.5,91.7 L 17.3,91.6 L 15.1,91.5 L 12.9,91.4 L 10.7,91.4 L 8.5,91.3 L 6.4,91.3 L 4.2,91.3 Z",
  "base03": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,93.2 L 93.6,93.2 L 91.5,93.3 L 89.3,93.3 L 87.1,93.3 L 84.9,93.4 L 82.7,93.5 L 80.5,93.5 L 78.4,93.6 L 76.2,93.7 L 74,93.7 L 71.8,93.8 L 69.6,93.8 L 67.5,93.8 L 65.3,93.8 L 63.1,93.8 L 60.9,93.8 L 58.7,93.8 L 56.5,93.8 L 54.4,93.8 L 52.2,93.6 L 50,93.1 L 47.8,92.5 L 45.6,91.5 L 43.5,90.5 L 41.3,89.4 L 39.1,88.3 L 36.9,87.1 L 34.7,85.9 L 32.5,84.9 L 30.4,84.2 L 28.2,83.5 L 26,83.2 L 23.8,82.8 L 21.6,82.5 L 19.5,82.3 L 17.3,82 L 15.1,81.9 L 12.9,81.7 L 10.7,81.6 L 8.5,81.6 L 6.4,81.5 L 4.2,81.5 Z",
  "base04": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,80.2 L 93.6,80 L 91.5,79.6 L 89.3,79.2 L 87.1,78.4 L 84.9,77.6 L 82.7,76.8 L 80.5,75.9 L 78.4,75 L 76.2,74.2 L 74,73.6 L 71.8,73.2 L 69.6,72.9 L 67.5,72.8 L 65.3,72.9 L 63.1,73 L 60.9,73.2 L 58.7,73.6 L 56.5,74.3 L 54.4,75.1 L 52.2,76.2 L 50,77.5 L 47.8,78.7 L 45.6,79.9 L 43.5,81 L 41.3,82 L 39.1,82.9 L 36.9,83.5 L 34.7,83.8 L 32.5,83.9 L 30.4,83.9 L 28.2,83.8 L 26,83.7 L 23.8,83.6 L 21.6,83.6 L 19.5,83.5 L 17.3,83.5 L 15.1,83.4 L 12.9,83.4 L 10.7,83.4 L 8.5,83.4 L 6.4,83.4 L 4.2,83.4 Z",
  "base05": "M 4.2,17.8 L 6.4,16.1 L 8.5,15.5 L 10.7,13.5 L 12.9,16.2 L 15.1,19.3 L 17.3,22.7 L 19.5,26.4 L 21.6,28.6 L 23.8,28.3 L 26,26.8 L 28.2,24.5 L 30.4,20.7 L 32.5,16.7 L 34.7,14 L 36.9,12.3 L 39.1,11.8 L 41.3,12.4 L 43.5,13.8 L 45.6,15.8 L 47.8,18 L 50,20.4 L 52.2,22.2 L 54.4,24.3 L 56.5,26.2 L 58.7,28.2 L 60.9,30.2 L 63.1,32 L 65.3,34.1 L 67.5,36.3 L 69.6,38.1 L 71.8,39.6 L 74,41.4 L 76.2,42.8 L 78.4,43.7 L 80.5,44.8 L 82.7,45.6 L 84.9,46.5 L 87.1,47.2 L 89.3,48.5 L 91.5,50.9 L 93.6,51.8 L 95.8,53.1 L 95.8,66.5 L 93.6,66.5 L 91.5,66.7 L 89.3,66.9 L 87.1,67.3 L 84.9,67.6 L 82.7,68 L 80.5,68.5 L 78.4,69 L 76.2,69.4 L 74,69.9 L 71.8,70.4 L 69.6,70.9 L 67.5,71.6 L 65.3,72.2 L 63.1,72.9 L 60.9,73.5 L 58.7,74.1 L 56.5,74.6 L 54.4,74.9 L 52.2,75.2 L 50,75.5 L 47.8,76.1 L 45.6,77.1 L 43.5,78.3 L 41.3,79.9 L 39.1,81.4 L 36.9,83 L 34.7,84.5 L 32.5,86.1 L 30.4,87.3 L 28.2,88.1 L 26,88.6 L 23.8,88.8 L 21.6,88.6 L 19.5,88.4 L 17.3,88.3 L 15.1,88.1 L 12.9,88 L 10.7,87.8 L 8.5,87.8 L 6.4,87.7 L 4.2,87.7 Z"
};

export const SOLE_CLIP: Record<string, string> = {
  "base01": "polygon(100.0% 75.5%,95.0% 75.5%,92.7% 75.5%,90.5% 75.5%,88.3% 75.6%,86.0% 75.7%,83.8% 75.9%,81.5% 76.1%,79.3% 76.4%,77.0% 76.7%,74.8% 77.0%,72.6% 77.3%,70.2% 77.6%,67.9% 77.9%,65.7% 78.1%,63.5% 78.2%,61.2% 78.2%,59.0% 78.1%,56.7% 77.9%,54.5% 77.6%,52.2% 77.2%,50.0% 76.8%,47.8% 76.3%,45.5% 75.7%,43.3% 75.1%,41.0% 74.5%,38.8% 73.8%,36.5% 73.2%,34.3% 72.6%,32.1% 72.0%,29.8% 71.4%,27.4% 70.9%,25.2% 70.4%,23.0% 69.9%,20.7% 69.5%,18.5% 69.2%,16.2% 68.9%,14.0% 68.7%,11.7% 68.5%,9.5% 68.4%,7.3% 68.3%,5.0% 68.3%,0.0% 68.3%,0.0% 112.0%,100.0% 112.0%)",
  "base02": "polygon(100.0% 74.0%,95.0% 74.0%,92.7% 74.2%,90.5% 74.3%,88.3% 74.5%,86.0% 74.9%,83.8% 75.2%,81.5% 75.5%,79.3% 75.9%,77.0% 76.2%,74.8% 76.5%,72.6% 76.7%,70.2% 77.2%,67.9% 78.0%,65.7% 79.2%,63.5% 80.8%,61.2% 82.6%,59.0% 84.4%,56.7% 86.2%,54.5% 87.9%,52.2% 89.6%,50.0% 90.9%,47.8% 91.7%,45.5% 92.2%,43.3% 92.3%,41.0% 92.3%,38.8% 92.2%,36.5% 92.2%,34.3% 92.1%,32.1% 92.1%,29.8% 92.1%,27.4% 92.0%,25.2% 91.9%,23.0% 91.9%,20.7% 91.8%,18.5% 91.7%,16.2% 91.6%,14.0% 91.5%,11.7% 91.4%,9.5% 91.3%,7.3% 91.3%,5.0% 91.3%,0.0% 91.3%,0.0% 112.0%,100.0% 112.0%)",
  "base03": "polygon(100.0% 93.2%,95.0% 93.2%,92.7% 93.2%,90.5% 93.3%,88.3% 93.3%,86.0% 93.4%,83.8% 93.4%,81.5% 93.5%,79.3% 93.6%,77.0% 93.7%,74.8% 93.7%,72.6% 93.8%,70.2% 93.8%,67.9% 93.8%,65.7% 93.8%,63.5% 93.8%,61.2% 93.8%,59.0% 93.8%,56.7% 93.8%,54.5% 93.8%,52.2% 93.6%,50.0% 93.1%,47.8% 92.5%,45.5% 91.5%,43.3% 90.4%,41.0% 89.3%,38.8% 88.1%,36.5% 86.9%,34.3% 85.7%,32.1% 84.8%,29.8% 84.0%,27.4% 83.4%,25.2% 83.0%,23.0% 82.7%,20.7% 82.4%,18.5% 82.2%,16.2% 81.9%,14.0% 81.8%,11.7% 81.7%,9.5% 81.6%,7.3% 81.5%,5.0% 81.5%,0.0% 81.5%,0.0% 112.0%,100.0% 112.0%)",
  "base04": "polygon(100.0% 80.2%,95.0% 80.2%,92.7% 79.8%,90.5% 79.4%,88.3% 78.8%,86.0% 78.0%,83.8% 77.2%,81.5% 76.3%,79.3% 75.4%,77.0% 74.5%,74.8% 73.8%,72.6% 73.3%,70.2% 73.0%,67.9% 72.9%,65.7% 72.8%,63.5% 72.9%,61.2% 73.2%,59.0% 73.5%,56.7% 74.2%,54.5% 75.1%,52.2% 76.2%,50.0% 77.5%,47.8% 78.7%,45.5% 80.0%,43.3% 81.1%,41.0% 82.2%,38.8% 83.0%,36.5% 83.5%,34.3% 83.8%,32.1% 83.9%,29.8% 83.9%,27.4% 83.8%,25.2% 83.7%,23.0% 83.6%,20.7% 83.5%,18.5% 83.5%,16.2% 83.5%,14.0% 83.4%,11.7% 83.4%,9.5% 83.4%,7.3% 83.4%,5.0% 83.4%,0.0% 83.4%,0.0% 112.0%,100.0% 112.0%)",
  "base05": "polygon(100.0% 66.5%,95.0% 66.5%,92.7% 66.6%,90.5% 66.8%,88.3% 67.1%,86.0% 67.5%,83.8% 67.8%,81.5% 68.3%,79.3% 68.8%,77.0% 69.3%,74.8% 69.7%,72.6% 70.2%,70.2% 70.8%,67.9% 71.4%,65.7% 72.1%,63.5% 72.8%,61.2% 73.4%,59.0% 74.0%,56.7% 74.5%,54.5% 74.9%,52.2% 75.2%,50.0% 75.5%,47.8% 76.1%,45.5% 77.1%,43.3% 78.4%,41.0% 80.1%,38.8% 81.6%,36.5% 83.3%,34.3% 84.8%,32.1% 86.3%,29.8% 87.5%,27.4% 88.4%,25.2% 88.7%,23.0% 88.7%,20.7% 88.5%,18.5% 88.4%,16.2% 88.2%,14.0% 88.0%,11.7% 87.9%,9.5% 87.8%,7.3% 87.7%,5.0% 87.7%,0.0% 87.7%,0.0% 112.0%,100.0% 112.0%)"
};

export const SOLE_ABOVE_CLIP: Record<string, string> = {
  "base01": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 75.5%,95.0% 75.5%,92.7% 75.5%,90.5% 75.5%,88.3% 75.6%,86.0% 75.7%,83.8% 75.9%,81.5% 76.1%,79.3% 76.4%,77.0% 76.7%,74.8% 77.0%,72.6% 77.3%,70.2% 77.6%,67.9% 77.9%,65.7% 78.1%,63.5% 78.2%,61.2% 78.2%,59.0% 78.1%,56.7% 77.9%,54.5% 77.6%,52.2% 77.2%,50.0% 76.8%,47.8% 76.3%,45.5% 75.7%,43.3% 75.1%,41.0% 74.5%,38.8% 73.8%,36.5% 73.2%,34.3% 72.6%,32.1% 72.0%,29.8% 71.4%,27.4% 70.9%,25.2% 70.4%,23.0% 69.9%,20.7% 69.5%,18.5% 69.2%,16.2% 68.9%,14.0% 68.7%,11.7% 68.5%,9.5% 68.4%,7.3% 68.3%,5.0% 68.3%,0.0% 68.3%)",
  "base02": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 74.0%,95.0% 74.0%,92.7% 74.2%,90.5% 74.3%,88.3% 74.5%,86.0% 74.9%,83.8% 75.2%,81.5% 75.5%,79.3% 75.9%,77.0% 76.2%,74.8% 76.5%,72.6% 76.7%,70.2% 77.2%,67.9% 78.0%,65.7% 79.2%,63.5% 80.8%,61.2% 82.6%,59.0% 84.4%,56.7% 86.2%,54.5% 87.9%,52.2% 89.6%,50.0% 90.9%,47.8% 91.7%,45.5% 92.2%,43.3% 92.3%,41.0% 92.3%,38.8% 92.2%,36.5% 92.2%,34.3% 92.1%,32.1% 92.1%,29.8% 92.1%,27.4% 92.0%,25.2% 91.9%,23.0% 91.9%,20.7% 91.8%,18.5% 91.7%,16.2% 91.6%,14.0% 91.5%,11.7% 91.4%,9.5% 91.3%,7.3% 91.3%,5.0% 91.3%,0.0% 91.3%)",
  "base03": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 93.2%,95.0% 93.2%,92.7% 93.2%,90.5% 93.3%,88.3% 93.3%,86.0% 93.4%,83.8% 93.4%,81.5% 93.5%,79.3% 93.6%,77.0% 93.7%,74.8% 93.7%,72.6% 93.8%,70.2% 93.8%,67.9% 93.8%,65.7% 93.8%,63.5% 93.8%,61.2% 93.8%,59.0% 93.8%,56.7% 93.8%,54.5% 93.8%,52.2% 93.6%,50.0% 93.1%,47.8% 92.5%,45.5% 91.5%,43.3% 90.4%,41.0% 89.3%,38.8% 88.1%,36.5% 86.9%,34.3% 85.7%,32.1% 84.8%,29.8% 84.0%,27.4% 83.4%,25.2% 83.0%,23.0% 82.7%,20.7% 82.4%,18.5% 82.2%,16.2% 81.9%,14.0% 81.8%,11.7% 81.7%,9.5% 81.6%,7.3% 81.5%,5.0% 81.5%,0.0% 81.5%)",
  "base04": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 80.2%,95.0% 80.2%,92.7% 79.8%,90.5% 79.4%,88.3% 78.8%,86.0% 78.0%,83.8% 77.2%,81.5% 76.3%,79.3% 75.4%,77.0% 74.5%,74.8% 73.8%,72.6% 73.3%,70.2% 73.0%,67.9% 72.9%,65.7% 72.8%,63.5% 72.9%,61.2% 73.2%,59.0% 73.5%,56.7% 74.2%,54.5% 75.1%,52.2% 76.2%,50.0% 77.5%,47.8% 78.7%,45.5% 80.0%,43.3% 81.1%,41.0% 82.2%,38.8% 83.0%,36.5% 83.5%,34.3% 83.8%,32.1% 83.9%,29.8% 83.9%,27.4% 83.8%,25.2% 83.7%,23.0% 83.6%,20.7% 83.5%,18.5% 83.5%,16.2% 83.5%,14.0% 83.4%,11.7% 83.4%,9.5% 83.4%,7.3% 83.4%,5.0% 83.4%,0.0% 83.4%)",
  "base05": "polygon(0.0% 0.0%,100.0% 0.0%,100.0% 66.5%,95.0% 66.5%,92.7% 66.6%,90.5% 66.8%,88.3% 67.1%,86.0% 67.5%,83.8% 67.8%,81.5% 68.3%,79.3% 68.8%,77.0% 69.3%,74.8% 69.7%,72.6% 70.2%,70.2% 70.8%,67.9% 71.4%,65.7% 72.1%,63.5% 72.8%,61.2% 73.4%,59.0% 74.0%,56.7% 74.5%,54.5% 74.9%,52.2% 75.2%,50.0% 75.5%,47.8% 76.1%,45.5% 77.1%,43.3% 78.4%,41.0% 80.1%,38.8% 81.6%,36.5% 83.3%,34.3% 84.8%,32.1% 86.3%,29.8% 87.5%,27.4% 88.4%,25.2% 88.7%,23.0% 88.7%,20.7% 88.5%,18.5% 88.4%,16.2% 88.2%,14.0% 88.0%,11.7% 87.9%,9.5% 87.8%,7.3% 87.7%,5.0% 87.7%,0.0% 87.7%)"
};
