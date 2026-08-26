# Architecture & Code Organization

## Project Structure

```
R2-Nusantara/
├── .github/
│   └── workflows/           # CI/CD workflows
│       ├── deploy.yml       # Production deployment
│       └── quality.yml      # Code quality checks
├── assets/
│   ├── images/              # Product & brand images
│   ├── fonts/               # Custom fonts
│   └── icons/               # SVG icons & favicon
├── css/
│   ├── main.css             # Global styles (10KB)
│   ├── components.css       # Component styles (13KB)
│   └── utilities.css        # Utility classes (11KB)
├── js/
│   ├── modules/
│   │   ├── cart.js          # Shopping cart logic
│   │   ├── wishlist.js      # Wishlist management
│   │   ├── products.js      # Product data & rendering
│   │   ├── checkout.js      # Order checkout
│   │   ├── config.js        # Global configuration
│   │   └── utils.js         # Helper functions
│   └── main.js              # Application entry point (8KB)
├── docs/                    # Project documentation
├── scripts/                 # Build & automation scripts
├── index.html               # Main HTML file
├── manifest.json            # PWA configuration
├── robots.txt               # SEO robots file
├── sitemap.xml              # SEO sitemap
├── sw.js                    # Service Worker (PWA)
├── package.json             # Dependencies & scripts
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── CONTRIBUTING.md          # Contribution guidelines
├── DEPLOYMENT.md            # Deployment documentation
├── ARCHITECTURE.md          # This file
├── SECURITY.md              # Security policy
└── README.md                # Project overview
```

## Module Architecture

### Core Modules

#### 1. **config.js** (Global Configuration)
- Constants dan feature flags
- Pagination, currency, shipping settings
- Social media & contact info
- Import: Semua modules
- Export: `CONFIG` object

#### 2. **utils.js** (Utility Functions)
- Formatting: `formatRupiah()`, `formatNumber()`
- Storage: `LocalStorage`, `SessionStorage`
- Validation: `validateEmail()`, `validatePhone()`
- Notifications: `showToast()`
- Helpers: `debounce()`, `throttle()`, `delay()`

#### 3. **products.js** (Product Management)
- Data management
- Filtering & sorting
- Search functionality
- Pagination
- Rendering product cards
- Quick view modal

#### 4. **cart.js** (Shopping Cart)
- Add/remove items
- Update quantities
- Calculate totals & taxes
- Shipping calculations
- Persistent localStorage
- Render cart UI

#### 5. **wishlist.js** (Wishlist Management)
- Add/remove wishlist items
- Persistence via localStorage
- Badge updates
- Wishlist rendering

#### 6. **checkout.js** (Order Processing)
- Form validation
- Address handling
- Payment method selection
- Auto-save form data
- Order submission

#### 7. **main.js** (Application Entry Point)
- Initialize all modules
- Setup event listeners
- Dark mode management
- Service Worker registration
- Global app state

## Data Flow

```
User Interaction
       |
       v
Event Listener (main.js)
       |
       v
Module Logic (cart.js, wishlist.js, etc.)
       |
       v
Data Processing (utils.js helpers)
       |
       v
LocalStorage (persistent state)
       |
       v
UI Update (render methods)
       |
       v
DOM Rendering (HTML output)
```

## State Management

### Local Storage Schema

```javascript
// Cart
localStorage['r2_cart'] = [
  { id, name, price, image, quantity }
]

// Wishlist
localStorage['r2_wishlist'] = [
  { id, name, price, image, addedAt }
]

// Recently Viewed
localStorage['r2_recently_viewed'] = [
  { id, viewedAt }
]

// Theme
localStorage['r2_theme'] = 'light' | 'dark'

// Checkout Data
localStorage['r2_checkout'] = {
  firstName, lastName, email, phone,
  address, city, province, zipCode,
  paymentMethod, agreeToTerms
}
```

## Styling Architecture

### CSS Structure

1. **main.css** (Global)
   - CSS variables & design tokens
   - Reset & base styles
   - Typography
   - Forms
   - Container & layout
   - Media queries

2. **components.css** (Components)
   - Buttons & badges
   - Cards & modals
   - Alerts & tabs
   - Pagination & tooltips
   - Animations & keyframes

3. **utilities.css** (Utilities)
   - Spacing utilities (margin, padding)
   - Display utilities
   - Text utilities
   - Color utilities
   - Responsive prefixes

### Design Tokens

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #1e40af;
  --color-danger: #dc2626;
  --color-success: #16a34a;
  
  /* Spacing */
  --space-sm: 0.5rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  
  /* Typography */
  --font-size-base: 1rem;
  --line-height-normal: 1.5;
  
  /* Shadows */
  --shadow-base: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

## Performance Considerations

### Bundle Size
- HTML: 170KB (pre-compressed)
- CSS: ~34KB combined
- JS: ~40KB combined
- Total: ~244KB (will compress to ~60-80KB with gzip)

### Optimization Strategies
1. **Image Lazy Loading**: Images load on scroll
2. **CSS Minification**: Production builds
3. **Tree Shaking**: Unused code removed
4. **Service Worker**: Offline support & caching
5. **Debounce/Throttle**: Event optimization

## Security

### Input Validation
- All user inputs validated
- Email & phone formats checked
- XSS prevention via innerHTML sanitization
- CSRF protection via form tokens

### Data Protection
- Sensitive data not stored in localStorage
- HTTPS required in production
- No API keys in frontend code
- Environment variables for configuration

## Accessibility

### WCAG 2.1 Compliance
- Semantic HTML structure
- ARIA labels & roles
- Keyboard navigation support
- Color contrast ratios
- Alternative text for images
- Screen reader friendly

### Keyboard Support
- Tab navigation
- Enter for forms
- Escape closes modals
- Arrow keys for pagination

## Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Mobile browsers (iOS Safari, Chrome Mobile)

## CI/CD Pipeline

```
Push to main
    |
    v
Checkout code
    |
    v
Install dependencies
    |
    v
Linting (ESLint)
    |
    v
Formatting (Prettier)
    |
    v
Unit Tests
    |
    v
Build
    |
    v
Upload artifact
    |
    v
Deploy to GitHub Pages
```

## Future Improvements

1. **Backend Integration**
   - API endpoints for products
   - Real payment processing
   - User authentication
   - Order management

2. **Performance**
   - Code splitting
   - Critical CSS
   - Image optimization
   - CDN distribution

3. **Features**
   - Product reviews
   - User accounts
   - Advanced search
   - Recommendations
   - Multi-language support

4. **Quality**
   - Comprehensive test suite
   - Visual regression testing
   - Accessibility audit
   - Performance monitoring

## References

- [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
