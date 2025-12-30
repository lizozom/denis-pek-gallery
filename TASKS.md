# Denis Pekerman Gallery - Implementation Tasks

## PHASE 0: Database Setup 🗄️

- [x] Initialize PostgreSQL database (`npm run db:init`)
- [x] Verify database connection is working
- [x] Check all environment variables are configured
- [x] Seed sample data (`npm run db:seed`) - 28 photos
- [x] Check that all manage operations are functional (create \ edit \ delete \ reorder)

## PHASE 1: Admin UI Polish & Image Upload 🎨

### Polish management system ✅ COMPLETED
 - [x]  Edit form opens in a overlay modal with image preview
 - [x]  Photo additions and edits reflect in the UI instantly (optimistic updates)
 - [x]  Photos display in descending order (newest first)
 - [x]  Delete should just hide the photo from the gallery by default. There can be a checkbox that if you check it - only then it will delete the photo completely.
 - [x]  Polish PhotoCard component with better styling and loading states
 - [x]  Polish PhotoManagement UI with stats dashboard and improved layout
 - [x]  Add gradient background and better visual hierarchy
 - [x]  Create PhotoStats component showing total and category breakdowns
 - [x]  Add icons to all buttons and improve empty states

 ### Polish gallery display ✅ COMPLETED
 - [x] Show the images with the highest position (newest) first
 - [x] Support different screen sizes by reducing num of cols to 2 or to 1 (4→3→2→1 responsive grid)
 - [x] If gallery images fail to load, don't show any fallback. Just show a graceful error message.
 - [x] Use better typography for image name (in overlay with gradient)
 - [x] Added loading skeletons with shimmer animation
 - [x] Added staggered fade-in animations
 - [x] Added sticky header and navigation
 - [x] Make the gallery filters work (client side filtering with category counts)
 
 ### Remove reordering option (complicates logic)
 - [ ] Get rid of the reorder option all together. 
 - [ ] Remove it from all docs (other than here in tasks)
 - [ ] Images should always show the newest ones first and that's it.

### Image Upload System
- [ ] Create `/app/admin/photos/upload-actions.ts` - Server actions for Vercel Blob upload
- [ ] Create `/app/admin/photos/components/ImageUploader.tsx` - File upload component
  - [ ] Drag-and-drop file upload
  - [ ] Browse file button
  - [ ] Image preview before upload
  - [ ] Progress indicator
  - [ ] File validation (type, size)
- [ ] Update `/app/admin/photos/components/PhotoForm.tsx` to use ImageUploader
- [ ] Add `getCategories()` function to `/lib/db.ts`
- [ ] Update `/next.config.ts` to add Vercel Blob to remotePatterns

## PHASE 2: Portfolio Enhancements 🖼️

### Gallery Layout Improvements ✅ COMPLETED
- [x] Create `/app/components/GalleryImage.tsx` - Individual gallery image component with loading states
- [x] Create `/app/components/ImageSkeleton.tsx` - Loading skeleton component
- [x] Update `/app/[locale]/page.tsx` gallery layout
  - [x] Better responsive grid (4/3/2/1 cols)
  - [x] Lazy loading with Intersection Observer
  - [x] Loading skeleton
  - [x] Better image aspect ratio handling
  - [x] Hover effects improvements (gradient overlay with title and category)
  - [x] Fade-in animations (staggered fade-in effect)
  - [x] Sticky header and navigation
  - [x] Empty state handling
  - [x] Better spacing and gap between images

### Enhanced Photo Detail Pages
- [ ] Create `/app/components/Breadcrumbs.tsx` - RTL-aware breadcrumbs
- [ ] Create `/app/components/PhotoNavigation.tsx` - Next/Previous arrows
- [ ] Update `/app/[locale]/photo/[slug]/page.tsx`
  - [ ] Add breadcrumbs
  - [ ] Next/Previous navigation (arrows + keyboard)
  - [ ] Share button (WhatsApp)
  - [ ] Better related photos algorithm
  - [ ] Larger image with zoom
  - [ ] Better mobile layout

## PHASE 3: Basic SEO Foundation ✅ COMPLETED

- [x] Create `/lib/config.ts` - Site configuration
  - [x] SITE_CONFIG with url, name
  - [x] SOCIAL_LINKS with Instagram, Facebook, Behance
- [x] Create `/lib/schema.ts` - Schema.org generators
  - [x] `generateOrganizationSchema()`
  - [x] `generateLocalBusinessSchema()`
  - [x] `generatePersonSchema()`
  - [x] `generateImageObjectSchema()`
  - [x] `generateBreadcrumbSchema()`
  - [x] `generateImageGallerySchema()`
  - [x] `generateProfessionalServiceSchema()`
- [x] Update `/lib/translations.ts` with SEO keywords
  - [x] English: architectural photographer Israel keywords
  - [x] Hebrew: צלם אדריכלות ישראל keywords
- [x] Update `/app/[locale]/layout.tsx`
  - [x] Add metadataBase
  - [x] Add canonical URLs
  - [x] Add hreflang tags
  - [x] Inject Organization schema

## PHASE 4: Navigation & Footer ✅ COMPLETED

- [x] Create `/app/components/Navigation.tsx`
  - [x] Gallery link
  - [x] Language toggle
  - [x] Mobile hamburger menu
  - [x] Responsive design
- [x] Create `/app/components/Footer.tsx`
  - [x] Copyright
  - [x] Social links
  - [x] Clean design
- [x] Update all pages to use Navigation and Footer components
- [x] The menu items should be Gallery (home page), language toggle
- [x] The h1 \ p main texts should live in the header
- [x] The menu should be beautifully designed and match the website design

## PHASE 5: Contact & About Pages 📞 (LATER)

- [ ] Create `/app/[locale]/about/page.tsx`
  - [ ] Professional bio
  - [ ] Photo of Denis
  - [ ] Expertise areas
  - [ ] Client types served
- [ ] Create `/app/[locale]/contact/page.tsx`
  - [ ] Contact form (Name, Email, Phone, Project Type, Message)
  - [ ] Form validation
  - [ ] Success/error states
- [ ] Create `/app/[locale]/contact/actions.ts` - Form submission
- [ ] Create `/lib/email.ts` - Email utilities
- [ ] Set up Resend for email delivery

## PHASE 6: Advanced Features 🚀 (FUTURE)

- [ ] Testimonials section
- [ ] Calendly integration
- [ ] WhatsApp floating button
- [ ] Google Analytics
- [ ] Dynamic OG images
- [ ] Enhanced sitemap
- [ ] Google Business Profile setup

---

## Quick Reference

### Files to Create
- `/lib/config.ts`
- `/lib/schema.ts`
- `/app/admin/photos/components/ImageUploader.tsx`
- `/app/admin/photos/components/PhotoStats.tsx`
- `/app/admin/photos/upload-actions.ts`
- `/app/components/GalleryGrid.tsx`
- `/app/components/Breadcrumbs.tsx`
- `/app/components/PhotoNavigation.tsx`
- `/app/components/Navigation.tsx`
- `/app/components/Footer.tsx`

### Files to Modify
- `/lib/translations.ts`
- `/lib/db.ts`
- `/app/[locale]/layout.tsx`
- `/app/[locale]/page.tsx`
- `/app/[locale]/photo/[slug]/page.tsx`
- `/app/admin/photos/components/PhotoManagement.tsx`
- `/app/admin/photos/components/PhotoCard.tsx`
- `/app/admin/photos/components/PhotoForm.tsx`
- `/app/admin/photos/actions.ts`
- `/next.config.ts`

### Database Functions to Add
```typescript
// In /lib/db.ts
export async function getCategories(): Promise<string[]>
export async function getGalleryPhotosByCategory(category: string): Promise<GalleryImage[]>
export async function getCategoryCounts(): Promise<Record<string, number>>
```

---

## Current Status: Phase 0 - Database Setup
**Next Action:** Run `npm run db:init` to initialize the database
