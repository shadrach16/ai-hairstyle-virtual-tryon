# Hair Studio — Landing Page

Professional SEO-optimized landing page for the Hair Studio app, hosted on GitHub Pages.

## Live URL
`https://waoapps.github.io/hair-studio/`

## Setup

### 1. Add Your Images
Place your app screenshots in `landing-page/img/`:

| File Name | Description | Source Image |
|-----------|-------------|--------------|
| `logo.png` | App logo (square, ~200x200px) | Your app icon |
| `og-image.png` | Social share preview (1200x630px) | Create from screenshots |
| `favicon-32.png` | Favicon 32x32 | Resize logo |
| `favicon-16.png` | Favicon 16x16 | Resize logo |
| `apple-touch-icon.png` | iOS bookmark icon (180x180) | Resize logo |
| `screenshot-home.png` | App home screen | Uploaded image #3 (browse styles) |
| `screenshot-categories.png` | Style categories grid | Uploaded image #4 (try before you cut) |
| `screenshot-result.png` | Before/after result | Uploaded image #1 (before/after braids) |
| `screenshot-app-mockup.png` | Phone mockup | Uploaded image #5 (phone mockup) |
| `before-after.png` | Before & after comparison | Uploaded image #1 (cropped) |

### 2. Configure Google Analytics
Replace `G-XXXXXXXXXX` in `index.html` with your actual GA4 Measurement ID:
1. Go to https://analytics.google.com/
2. Create a new property for your landing page
3. Get the Measurement ID (format: `G-XXXXXXX`)
4. Replace in the `<head>` section of `index.html`

### 3. Configure SEO URLs
If your GitHub username/org is different from `waoapps`, update all URLs in:
- `index.html` (canonical, og:url, og:image, twitter:image)
- `sitemap.xml` (all `<loc>` tags)
- `robots.txt` (Sitemap URL)
- `privacy.html` (canonical)
- `terms.html` (canonical)

### 4. Deploy to GitHub Pages

**Option A: GitHub Actions (Recommended)**
Push the repo to GitHub. The workflow at `.github/workflows/deploy-landing-page.yml` will auto-deploy on push.

In your repo settings:
1. Go to Settings → Pages
2. Source: **GitHub Actions**

**Option B: Manual**
1. Go to repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` (or `master`)
4. Folder: `/landing-page`
5. Save

### 5. Google Search Console
1. Go to https://search.google.com/search-console/welcome
2. Add property → URL prefix → paste your Pages URL
3. Verify via HTML file (add verification file to `landing-page/`)
4. Submit sitemap: `sitemap.xml`
5. Request indexing for main URL

### 6. Bing IndexNow (Optional)
```
https://www.bing.com/indexnow?url=https://waoapps.github.io/hair-studio/&key=hair-studio
```

## Analytics Dashboard
With GA4 configured, you'll automatically track:
- **Page views** (total visitors)
- **Download clicks** (via custom `download_click` events)
- **Traffic sources** (organic, social, direct)
- **Device/geo breakdown**

View in Google Analytics → Reports → Engagement → Events

## File Structure
```
landing-page/
├── index.html          # Main landing page
├── privacy.html        # Privacy policy
├── terms.html          # Terms of use
├── 404.html            # Custom 404 page
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler rules
├── css/
│   └── style.css       # All styles
├── js/
│   └── main.js         # Interactions & tracking
└── img/                # Screenshots & assets
```

## SEO Features Included
- ✅ Semantic HTML5 structure
- ✅ Open Graph meta tags (Facebook, LinkedIn)
- ✅ Twitter Card meta tags
- ✅ JSON-LD structured data (SoftwareApplication + FAQPage)
- ✅ Responsive sitemap.xml
- ✅ robots.txt with sitemap reference
- ✅ Canonical URLs
- ✅ Mobile-first responsive design
- ✅ Performance optimized (lazy loading, preconnect)
- ✅ Accessibility (WCAG contrast, keyboard nav, reduced motion)
- ✅ FAQ section for Google rich results
