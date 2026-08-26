# Contributing to R2-Nusantara

Terima kasih telah tertarik untuk berkontribusi pada proyek R2-Nusantara!

## Code of Conduct

Proyek ini mematuhi Code of Conduct. Dengan berpartisipasi, Anda diharapkan untuk menjunjung tinggi standar ini.

## Cara Berkontribusi

### 1. Fork Repository

```bash
git clone https://github.com/YOUR_USERNAME/R2-Nusantara.git
cd R2-Nusantara
```

### 2. Buat Branch Feature

```bash
git checkout -b feature/your-feature-name
# atau untuk bug fix:
git checkout -b bugfix/your-bug-fix
```

### 3. Setup Development Environment

```bash
npm install
npm run dev
```

### 4. Ikuti Style Guide

- **Linting**: Jalankan `npm run lint:fix` sebelum commit
- **Formatting**: Gunakan `npm run format` untuk format konsisten
- **Testing**: Pastikan tests lulus dengan `npm test`

### 5. Commit Messages

Gunakan format konvensional:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Contoh:
```
feat(wishlist): add local storage persistence

Implement local storage to persist wishlist data
across browser sessions.

Closes #123
```

### 6. Push ke Fork dan Buat Pull Request

```bash
git push origin feature/your-feature-name
```

## Pull Request Guidelines

- Jelaskan perubahan dengan jelas di PR description
- Reference issues yang relevan (Closes #123)
- Pastikan semua tests lulus
- Ikuti style guide project
- 1 feature/fix per PR

## Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Linting dan fixing
npm run lint:fix
npm run format

# Run tests
npm test
npm run test:watch

# Build untuk production
npm run build
```

## Reporting Bugs

Ketika melaporkan bug, sertakan:

- Deskripsi jelas tentang bug
- Langkah reproduksi
- Expected behavior
- Actual behavior
- Environment (browser, OS, etc.)
- Screenshots jika applicable

## Requesting Features

Untuk feature requests:

- Jelaskan use case
- Jelaskan benefit untuk users
- Contoh atau mockup jika ada

## Questions?

Buat issue dengan label `question` atau hubungi maintainer.

Terima kasih atas kontribusi Anda! 🎉
