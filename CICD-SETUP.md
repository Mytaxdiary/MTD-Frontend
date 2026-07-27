# CI/CD setup (Frontend)

This repo deploys to Hetzner on every push to `main` via `.github/workflows/deploy-frontend.yml`.

Server path: `/var/www/mtd/frontend`  
PM2 process: `mtd-frontend`  
App URL: `https://app.mytaxdiary.co.uk`

## Required GitHub secrets

Create these in **GitHub → MTD-Frontend → Settings → Secrets and variables → Actions**.

Also create a GitHub Environment named `production` (Settings → Environments → New environment) and add the same secrets there if you prefer environment-scoped secrets. The workflow uses `environment: production`.

| Secret | Example | Notes |
|---|---|---|
| `DEPLOY_HOST` | `1.2.3.4` or `app.mytaxdiary.co.uk` | Server IP or hostname |
| `DEPLOY_USER` | `deploy` | Non-root SSH user |
| `DEPLOY_SSH_KEY` | full private key PEM | Includes `-----BEGIN ... KEY-----` lines |
| `DEPLOY_PORT` | `22` | SSH port |

Do not put `.env` values in GitHub. The server keeps its existing `.env` and the pipeline never overwrites it.

## Generate a dedicated deploy SSH key

On your local machine (or a secure admin machine):

```bash
ssh-keygen -t ed25519 -C "github-actions-mtd-frontend" -f ./mtd-frontend-deploy -N ""
```

This creates:

- `mtd-frontend-deploy` (private key → GitHub secret `DEPLOY_SSH_KEY`)
- `mtd-frontend-deploy.pub` (public key → server)

## Add the public key on the Hetzner server

SSH in as an admin, then:

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG www-data deploy   # only if your app files need that group
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo nano /home/deploy/.ssh/authorized_keys
# paste contents of mtd-frontend-deploy.pub
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

Give the deploy user access to the app directory (adjust ownership as needed):

```bash
sudo chown -R deploy:deploy /var/www/mtd/frontend
```

Confirm the user can restart PM2 without root (PM2 should already be set up under this user, or use a shared PM2 home that this user owns).

Test SSH:

```bash
ssh -i ./mtd-frontend-deploy -p 22 deploy@YOUR_SERVER_IP
```

## Add the private key in GitHub

1. Open `mtd-frontend-deploy` and copy the full private key.
2. GitHub → repo → Settings → Secrets and variables → Actions → New repository secret.
3. Name: `DEPLOY_SSH_KEY`
4. Value: paste the private key.
5. Add `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT` the same way.

Then delete the local private key file once it is stored in GitHub, or keep it only in a password manager. Never commit it.

## How to test the pipeline

1. Confirm secrets and the `production` environment exist.
2. Make a small commit on `main` (or merge a PR into `main`).
3. Open GitHub → Actions → **Deploy Frontend**.
4. Confirm **Lint, typecheck and build** passes, then **Deploy to Hetzner** passes.
5. Visit `https://app.mytaxdiary.co.uk` and confirm the app loads.

You can also trigger a re-run from the Actions tab without a new commit.

## Manual rollback if deploy fails

On the server as the deploy user:

```bash
cd /var/www/mtd/frontend
git log --oneline -5
git checkout <previous-good-commit>
npm ci
rm -rf .next
npm run build
pm2 restart mtd-frontend --update-env
pm2 save
curl -fsS http://localhost:3000
```

To return to latest `main` later:

```bash
git checkout main
git merge --ff-only origin/main
npm ci
rm -rf .next
npm run build
pm2 restart mtd-frontend --update-env
pm2 save
```

## Notes

- Pipeline uses `git merge --ff-only` (no `git reset --hard`), so local server changes that diverge from `main` will fail the deploy instead of wiping them.
- Uploads and `.env` are never deleted by the workflow.
- Frontend and backend use separate concurrency groups, so they will not cancel each other.
