# Security Policy for R2-Nusantara

## Reporting Security Vulnerabilities

If you discover a security vulnerability in R2-Nusantara, please email us at `security@r2nusantara.com` instead of using the issue tracker.

Please include the following information in your report:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Any suggested fixes

## Supported Versions

Only the latest version is supported for security updates.

## Security Best Practices

When using R2-Nusantara:
- Keep all dependencies updated
- Use environment variables for sensitive data
- Never commit `.env` files or API keys
- Validate all user inputs
- Use HTTPS in production
- Keep Node.js and npm updated

## Dependencies Security

We regularly run `npm audit` to identify and fix security vulnerabilities in dependencies.

## Security Checklist

- [ ] All user inputs validated
- [ ] No sensitive data in frontend
- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] Dependencies regularly updated
- [ ] Security audit clean
- [ ] XSS prevention implemented
- [ ] CSRF tokens used
- [ ] SQL injection prevention (if applicable)
- [ ] Access control properly configured

## Responsible Disclosure

We take security seriously and appreciate responsible disclosure practices.
