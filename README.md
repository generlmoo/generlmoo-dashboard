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

## Notes on status indicators

The status pill uses a best-effort browser `fetch()` check. Some services may show **offline** due to networking, DNS, or browser restrictions.
Even if the status is offline, the links will still work.

## Customize

- Update service names/URLs in `script.js`
- Change colors in `styles.css`
- Replace the GitHub link in the header with your repo URL
