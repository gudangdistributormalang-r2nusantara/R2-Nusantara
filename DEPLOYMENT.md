# R2-Nusantara Professional Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [GitHub Pages Deployment](#github-pages-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- GitHub account with repository access

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/gudangdistributormalang-r2nusantara/R2-Nusantara.git
cd R2-Nusantara
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8000`

### 4. Code Quality Checks

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Testing
npm test
```

## GitHub Pages Deployment

### Automatic Deployment (CI/CD)

Repository ini menggunakan GitHub Actions untuk otomatis deploy ke GitHub Pages saat push ke `main` branch.

**Process:**
1. Push ke branch `main`
2. GitHub Actions workflow `/github/workflows/deploy.yml` triggered
3. Code di-lint, di-format, dan di-test
4. Artifact di-upload ke GitHub Pages
5. Website live di: `https://gudangdistributormalang-r2nusantara.github.io/R2-Nusantara`

### Manual Deployment

Jika perlu deploy manual:

```bash
# Build
npm run build

# Deploy
git add .
git commit -m "Deploy: [description]"
git push origin main
```

### Enable GitHub Pages

1. Buka **Settings** repository
2. Pilih **Pages** (sidebar)
3. Source: Select branch `gh-pages`
4. Save

## Environment Configuration

### Environment Variables

Buat file `.env` (tidak di-commit):

```env
# API Configuration
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_TIMEOUT=30000

# Analytics
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ANALYTICS_ID=UA-XXXXXXXXX-X

# Feature Flags
REACT_APP_ENABLE_WISHLIST=true
REACT_APP_ENABLE_DARK_MODE=true
```

### Production vs Development

**Development:**
```bash
npm run dev
# Uses default config, hot reload enabled
```

**Production:**
```bash
npm run build
# Minified, optimized for deployment
```

## Performance Optimization

### Image Optimization

```bash
# Convert images to WebP
scripts/optimize-images.sh

# Lazy loading enabled by default
# Configure in config.js: IMAGE_LAZY_LOAD_OFFSET
```

### CSS & JavaScript

- Minified CSS in production
- ES modules bundling
- Tree-shaking enabled
- Source maps for debugging

### Caching Strategy

**Service Worker** (`sw.js`):
- Cache HTML, CSS, JS
- Cache images (strategy: cache-first)
- Network-first for API calls

### Lighthouse Performance

**Target Scores:**
- Performance: >= 90
- Accessibility: >= 95
- Best Practices: >= 90
- SEO: >= 95

**Run Audit:**
```bash
# Using DevTools in Chrome
# 1. Open DevTools (F12)
# 2. Lighthouse tab
# 3. Generate report
```

## Monitoring & Maintenance

### Regular Tasks

**Weekly:**
- Monitor GitHub Actions logs
- Check for broken links
- Review analytics

**Monthly:**
- Security audit: `npm audit`
- Update dependencies: `npm update`
- Performance review
- Backup configuration

### Dependency Updates

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update to latest major version (caution)
npm install <package>@latest
```

### Security Maintenance

```bash
# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# High-risk fixes only
npm audit fix --force
```

### Monitoring Tools

- **GitHub Status**: Monitor Actions runs
- **Lighthouse CI**: Auto performance testing
- **Dependabot**: Auto dependency updates

### Troubleshooting

**Deployment Failed:**
1. Check GitHub Actions logs: Actions tab → Latest run
2. Verify `package.json` scripts
3. Check for lint/format errors
4. Verify Node.js version compatibility

**Website Not Updating:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check Service Worker: DevTools → Application
3. Hard refresh: Ctrl+F5
4. Wait 5 minutes for GitHub Pages cache

**Build Errors:**
```bash
# Clean installation
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Rollback Procedure

Jika deployment bermasalah:

```bash
# Lihat commit history
git log --oneline

# Revert ke commit sebelumnya
git revert <commit-hash>
git push origin main

# GitHub Actions akan auto-deploy ke versi sebelumnya
```

## Production Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Code formatted correctly
- [ ] Environment variables configured
- [ ] Security audit clean
- [ ] Performance optimized
- [ ] Accessibility checked
- [ ] SEO optimized
- [ ] Analytics configured
- [ ] Monitoring setup

## Support & Contact

- **Issues**: GitHub Issues
- **Security**: security@r2nusantara.com
- **Support**: support@r2nusantara.com

## References

- [GitHub Pages Documentation](https://pages.github.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [Web Performance](https://web.dev/performance/)
