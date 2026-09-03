/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp']
  },
  async redirects() {
    // Mirrors source/_redirects — legacy / shorthand paths -> canonical URLs
    return [
      { source: '/customs', destination: '/create-your-own', permanent: true },
      { source: '/create', destination: '/create-your-own', permanent: true },
      { source: '/design', destination: '/create-your-own', permanent: true },
      { source: '/shop', destination: '/base-trainers', permanent: true },
      { source: '/in-stock', destination: '/base-trainers', permanent: true },
      { source: '/drops', destination: '/base-trainers', permanent: true },
      { source: '/faq', destination: '/sizing-and-care', permanent: true },
      { source: '/sizing', destination: '/sizing-and-care', permanent: true },
      { source: '/care', destination: '/sizing-and-care', permanent: true },
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/t-and-c', destination: '/terms-and-conditions', permanent: true }
    ];
  }
};

export default nextConfig;
