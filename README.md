# Denis Pek Gallery

A modern, SEO-optimized photography gallery built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **SEO Optimized**: Complete metadata, Open Graph tags, Twitter cards, robots.txt, and sitemap
- **Responsive Design**: Beautiful grid layout that works on all devices
- **Image Optimization**: Uses Next.js Image component for automatic optimization
- **Modern Stack**: Built with Next.js 15 App Router, TypeScript, and Tailwind CSS
- **Category Filtering**: Navigate photos by category (Landscape, Portrait, Urban, Nature)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd denis-pek-gallery
```

2. Install dependencies (already done):
```bash
npm install
```

3. Add your gallery images:
   - Place your images in `public/gallery/`
   - Name them: `image-1.jpg`, `image-2.jpg`, etc.
   - Update the `galleryImages` array in `app/page.tsx` with your image details

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
denis-pek-gallery/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Gallery homepage
│   ├── globals.css         # Global styles
│   ├── robots.ts           # robots.txt configuration
│   └── sitemap.ts          # Sitemap configuration
├── public/
│   └── gallery/            # Gallery images directory
└── package.json
```

## Customization

### Update Site Information

Edit `app/layout.tsx` to customize:
- Site title and description
- Author name
- Domain URL
- Social media metadata

### Add More Images

Edit the `galleryImages` array in `app/page.tsx`:

```typescript
const galleryImages = [
  {
    id: 1,
    src: "/gallery/your-image.jpg",
    alt: "Description of image",
    title: "Image Title",
    category: "Category Name",
  },
  // Add more images...
];
```

### Customize Styles

The project uses Tailwind CSS. Modify classes in the components or update `tailwind.config.ts` for theme changes.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is ready to deploy on Vercel, Netlify, or any platform that supports Next.js:

1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Deploy!

For Vercel:
```bash
npx vercel
```

## SEO Features

- Comprehensive metadata configuration
- Open Graph tags for social media sharing
- Twitter Card support
- Semantic HTML structure
- Optimized images with Next.js Image component
- Automatic sitemap generation
- robots.txt configuration
- Responsive design for better mobile SEO

## License

All rights reserved © Denis Pek

## Support

For questions or support, please open an issue in the project repository.
