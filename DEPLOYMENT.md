# GitHub Pages Deployment Guide

This project is configured for automatic deployment to GitHub Pages using the latest GitHub Actions (2025).

## 🚀 Features

- ✅ **Latest GitHub Actions**: `upload-pages-artifact@v3` + `deploy-pages@v4`
- ✅ **React Router Support**: Full BrowserRouter compatibility with 404 fallback
- ✅ **Auto-Deployment**: Triggers on push to `main` branch
- ✅ **Manual Deploy**: Can trigger manually from Actions tab
- ✅ **SPA Routing**: Works with client-side routing across all routes

## 📋 Prerequisites

1. **GitHub Repository Settings**:
   - Go to **Settings** → **Pages**
   - Set **Source** to **GitHub Actions** (not Deploy from a branch)
   - Click **Save**

2. **Repository Secrets** (Optional):
   - No secrets required for public repositories
   - For private repos, ensure Actions have write permissions

## 🛠️ Configuration

### For Root Domain Deployment (`username.github.io`)

Set `BASE_URL` to `/` in `.github/workflows/deploy.yml` so asset paths
and routing work correctly for a root site.

### For Project Subdirectory (`username.github.io/repo-name/`)

The workflow already sets `BASE_URL` to `/<repo-name>/` using the repository name.
If you need to override it, edit `.github/workflows/deploy.yml`:
```yaml
# GitHub Pages project site base path (owner.github.io/repo-name/)
BASE_URL: /${{ github.event.repository.name }}/
```

Or set it explicitly:
```yaml
BASE_URL: /your-repo-name/
```

### For Root Domain Deployment (`username.github.io`)

Set `BASE_URL` to `/` in `.github/workflows/deploy.yml`:
```yaml
BASE_URL: /
```

## 🔄 How It Works

### Deployment Flow

1. **Push to `main`** → Triggers workflow
2. **Build Job**:
   - Checks out code
   - Installs dependencies (npm ci)
   - Builds with Vite (`npm run build`)
   - Uploads `dist/` as artifact
3. **Deploy Job**:
   - Downloads artifact
   - Deploys to GitHub Pages
4. **Live Site** → Available at repository URL

### Hash Router Support (Works on Any Static Host)

This project uses `HashRouter` so client-side routing works on static hosts
without server rewrite rules (GitHub Pages, S3, etc.).

When users access `https://your-site.com/about` directly:
- GitHub Pages serves `404.html`
- Script redirects to `/#/about` (or `/repo-name/#/about`)
- React Router renders the correct page
- User sees correct content! ✨

## 📁 File Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow
├── public/
│   └── 404.html              # SPA routing fallback
├── src/
│   └── main.tsx              # Route restoration logic
├── vite.config.ts            # Build configuration
└── dist/                     # Build output (auto-generated)
```

## 🧪 Testing Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚨 Troubleshooting

### Issue: "Page not found" on route refresh

**Solution**: Ensure 404.html is in `public/` and built to `dist/404.html`

### Issue: Assets not loading (404)

**Solution**: Check `vite.config.ts` base path:
- Root domain: `base: "/"`
- Subdirectory: `base: "/repo-name/"`

### Other Hosting Providers

For Netlify, Vercel, Cloudflare Pages, etc.:
- Set `BASE_URL` to `/` (or their required sub-path)
- No special rewrite rules required because routing uses hashes
- If you host under a subdirectory on non-GitHub hosts, update `public/404.html`
  to set `basePath` explicitly

### Issue: Workflow fails at deploy step

**Solution**: Verify GitHub Pages source is set to **GitHub Actions** in repository settings

### Issue: Build succeeds but site doesn't update

**Solution**:
1. Check Actions tab for workflow status
2. Ensure deployment job completed successfully
3. Hard refresh browser (Ctrl+Shift+R)

## 📊 Monitoring Deployment

### View Deployment Status

1. Go to repository **Actions** tab
2. Click on latest "Deploy to GitHub Pages" workflow
3. View build and deployment logs
4. Check deployment URL at bottom of job summary

### Deployment URL

After successful deployment:
- **Root**: `https://username.github.io/`
- **Project**: `https://username.github.io/repo-name/`

## 🔧 Customization

### Change Build Command

Edit `.github/workflows/deploy.yml` line 43:
```yaml
npm run build
```

### Add Environment Variables

```yaml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  BASE_URL: /repo-name/
```

### Deploy on Pull Request

Add to `on` section:
```yaml
pull_request:
  branches:
    - main
```

### Multiple Environments

```yaml
jobs:
  build-and-deploy:
    strategy:
      matrix:
        environment: [staging, production]
```

## 🔐 Security

- **Permissions**: Minimal required permissions only
- **Concurrency**: Prevents race conditions
- **Dependencies**: Uses `npm ci` for reproducible builds
- **Caching**: Node modules cached for faster builds

## 📚 Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [React Router BrowserRouter Guide](https://reactrouter.com/en/main/start/overview)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html)

## 🆕 Updates (2025)

- ✅ Upgraded to `actions/upload-pages-artifact@v3`
- ✅ Upgraded to `actions/deploy-pages@v4`
- ✅ Added Node.js 20 LTS support
- ✅ Improved concurrency handling
- ✅ Enhanced SPA routing fallback
- ✅ Added manual workflow dispatch

---

**Last Updated**: January 2025
**Maintained by**: Climate Story Team
