# Candidate5 Landing Page Implementation Guide

## Overview
This guide provides step-by-step instructions to implement the new responsive landing page based on your Figma designs into your existing Next.js application.

## Prerequisites
- Next.js application (App Router or Pages Router)
- Tailwind CSS configured
- TypeScript support (recommended)

## Installation Steps

### 1. Install Required Dependencies
If you don't already have these installed:

```bash
npm install tailwindcss @tailwindcss/aspect-ratio
# or
yarn add tailwindcss @tailwindcss/aspect-ratio
```

### 2. Update Tailwind Configuration
Add the aspect-ratio plugin to your `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### 3. Create Component Directory Structure
Create the following directory structure in your project:

```
components/
├── landing/
│   ├── LandingPage.tsx
│   ├── HeroSection.tsx
│   ├── StatisticsCards.tsx
│   ├── HowItWorksSection.tsx
│   ├── TestimonialsSection.tsx
│   └── Footer.tsx
└── ui/
    └── Navigation.tsx (optional)
```

### 4. Add Component Files
Copy the component code from the provided files into your project:

#### components/landing/LandingPage.tsx
```typescript
import React from 'react';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialsSection } from './TestimonialsSection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};
```

#### components/landing/HeroSection.tsx
```typescript
// Copy the enhanced hero section code here
// (Use the EnhancedHeroSection from enhanced-components.tsx)
```

### 5. Update Your Main Page
Replace your current landing page with the new component:

#### For App Router (app/page.tsx):
```typescript
import { LandingPage } from '@/components/landing/LandingPage';

export default function HomePage() {
  return <LandingPage />;
}
```

#### For Pages Router (pages/index.tsx):
```typescript
import { LandingPage } from '../components/landing/LandingPage';

export default function HomePage() {
  return <LandingPage />;
}
```

### 6. Add Image Assets
Replace the placeholder images with your actual assets:

1. Add your hero image to `public/images/hero-woman-desk.jpg`
2. Add your "How It Works" illustrations to:
   - `public/images/paste-job-posting.jpg`
   - `public/images/showcase-skills.jpg`
   - `public/images/stay-informed.jpg`

Update the image sources in the components:
```typescript
// Replace /api/placeholder/600/500 with:
src="/images/hero-woman-desk.jpg"

// Replace illustration placeholders with:
src="/images/paste-job-posting.jpg"
src="/images/showcase-skills.jpg"
src="/images/stay-informed.jpg"
```

### 7. Customize Colors and Branding
Update the color scheme to match your exact brand colors:

```typescript
// In your components, replace teal-500 with your brand color
className="text-teal-500" // Replace with your brand color
className="bg-teal-500"   // Replace with your brand color
```

### 8. Add Navigation (Optional)
If you want to include the navigation component:

```typescript
// app/layout.tsx (App Router)
import { Navigation } from '@/components/ui/Navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
```

## Responsive Breakpoints
The landing page is designed with these breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Customization Options

### 1. Content Updates
Update the text content in each component to match your exact copy:

```typescript
// In HeroSection.tsx
<h1 className="...">
  Your Custom Headline Here
</h1>
<p className="...">
  Your custom description here.
</p>
```

### 2. Statistics Cards
Update the statistics in `StatisticsCards.tsx`:

```typescript
const stats = [
  {
    percentage: '80%',
    title: 'your custom stat',
    description: 'your description'
  },
  // ... more stats
];
```

### 3. How It Works Steps
Customize the steps in `HowItWorksSection.tsx`:

```typescript
const steps = [
  {
    title: 'Your Step Title',
    description: 'Your step description',
    icon: '📋', // Use your preferred emoji or icon
    illustration: '/images/your-image.jpg'
  },
  // ... more steps
];
```

### 4. Call-to-Action Buttons
Update button text and links:

```typescript
<button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg">
  Your CTA Text
</button>
```

## Testing
1. Start your development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Test responsive behavior:
   - Open browser developer tools
   - Test mobile (375px), tablet (768px), and desktop (1200px) views
   - Verify all sections display correctly
   - Check that images load properly
   - Test button interactions

## Performance Optimization

### 1. Image Optimization
Use Next.js Image component for better performance:

```typescript
import Image from 'next/image';

<Image
  src="/images/hero-woman-desk.jpg"
  alt="Professional woman working at desk with plants"
  width={600}
  height={500}
  className="rounded-lg object-cover shadow-lg"
  priority // For above-the-fold images
/>
```

### 2. Lazy Loading
For images below the fold, ensure lazy loading is enabled (default in Next.js Image).

### 3. Font Optimization
If using custom fonts, add them to your `next.config.js`:

```javascript
// next.config.js
module.exports = {
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
}
```

## Deployment Checklist
- [ ] All images are optimized and properly sized
- [ ] All placeholder content is replaced with actual content
- [ ] Colors match your brand guidelines
- [ ] Responsive design works on all devices
- [ ] All links and buttons function correctly
- [ ] Page loads quickly (< 3 seconds)
- [ ] SEO meta tags are added
- [ ] Analytics tracking is implemented

## SEO Enhancements
Add these to your page for better SEO:

```typescript
// app/page.tsx (App Router)
export const metadata = {
  title: 'Land Interviews Twice as Fast | Candidate 5',
  description: 'AI-powered CV optimization that helps you land interviews twice as fast. Tailored CVs in minutes.',
  keywords: 'CV optimization, resume builder, ATS, job search, AI',
};

// pages/index.tsx (Pages Router)
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Land Interviews Twice as Fast | Candidate 5</title>
        <meta name="description" content="AI-powered CV optimization that helps you land interviews twice as fast." />
        <meta name="keywords" content="CV optimization, resume builder, ATS, job search, AI" />
      </Head>
      <LandingPage />
    </>
  );
}
```

## Troubleshooting

### Common Issues:
1. **Tailwind styles not applying**: Ensure Tailwind is properly configured and your content paths are correct
2. **Images not loading**: Check file paths and ensure images are in the public directory
3. **Layout issues on mobile**: Test with actual devices, not just browser dev tools
4. **TypeScript errors**: Ensure all imports have proper type definitions

### Support:
If you encounter issues during implementation, check:
1. Next.js documentation for your specific version
2. Tailwind CSS documentation for utility classes
3. Browser console for JavaScript errors
4. Network tab for failed resource loads

This implementation provides a solid foundation that matches your Figma designs while being fully responsive and optimized for performance.

