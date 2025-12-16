# generlmoo-dashboard

A black + neon-blue landing page for **generlmoo.me** that links out to your homelab services:

- **files.generlmoo.me** (FileBrowser)
- **watch.generlmoo.me** (Jellyfin)
- **nas.generlmoo.me** (NAS / OMV)
- **pihole.generlmoo.me** (Pi-hole)

## Deploy (Cloudflare Pages — recommended)

1. Create a new GitHub repo and add these files.
2. In Cloudflare: **Workers & Pages → Pages → Create application → Connect to Git**
3. Framework preset: **None**
4. Build command: *(blank)*
5. Output directory: *(blank)*
6. Set the custom domain: **generlmoo.me**

## Local preview

Just open `index.html` in a browser.

## Commit and push changes to GitHub

1. Check your work: `git status` and review any modified files.
2. Stage updates: `git add <files>` (or `git add .` for everything).
3. Commit with a clear message: `git commit -m "Describe what changed"`.
4. Add the GitHub remote if you have not already: `git remote add origin git@github.com:<user>/<repo>.git`.
5. Push the branch: `git push -u origin <branch>`. (If the branch already exists, omit `-u`.)
6. Open a pull request on GitHub if you want a review, or merge directly if you have permission.

## Notes on status indicators

The status pill uses a best-effort browser `fetch()` check. Some services may show **offline** due to networking, DNS, or browser restrictions.
Even if the status is offline, the links will still work.

## Customize

- Update service names/URLs in `script.js`
- Change colors in `styles.css`
- Replace the GitHub link in the header with your repo URL
