# Deploying rianiregho-web with Docker

The site is a single Next.js app (pages **and** API) running in one Docker
container on the same server as the Postgres database. Apache terminates TLS and
proxies the domain to the container.

```
Visitor ──HTTPS──▶ Cloudflare ──▶ Apache (:443) ──▶ 127.0.0.1:8021 ──▶ [rianiregho-web container :3000]
                                                                              │            │
                                              host.docker.internal:5432 ◀─────┘            └──▶ /data/uploads  (host folder)
                                              pgdb (Postgres 15, DB: rianiregho_web)
```

| Thing            | Value                                                           |
| ---------------- | --------------------------------------------------------------- |
| Server           | `31.97.107.242`                                                 |
| App folder       | `/var/www/rp/rianiregho-web`                         |
| Uploads folder   | `/var/www/rp/rianiregho-web-uploads` (mounted at `/data/uploads`)   |
| Container / port | `rianiregho-web`, host `127.0.0.1:8021` → container `3000`      |
| Database         | `pgdb` container, db `rianiregho_web`, host port `5432`         |

Files involved: [`Dockerfile`](../Dockerfile), [`docker-compose.yml`](../docker-compose.yml),
[`deploy/env.production.example`](../deploy/env.production.example),
[`deploy/apache-rianiregho.conf`](../deploy/apache-rianiregho.conf),
[`deploy/update.sh`](../deploy/update.sh) (server-side, with git),
[`deploy/deploy.sh`](../deploy/deploy.sh) (rsync from your machine).

---

## Redeploy after you change the project

Day-to-day this is all you need. The database and uploaded images live outside
the container, so a redeploy never touches them.

```
 your machine                                   server
 ────────────                                   ──────
 1. test         npm run build  (optional)
 2. commit + push to main
                                                3. ssh in, then:
                                                   cd /var/www/rp/rianiregho-web
                                                   ./deploy/update.sh
                                                4. check https://rianiregho.com
```

**What step 3 does:** `git pull --ff-only` → tags the running image as
`rianiregho-web:previous` → `docker compose build` → `docker compose up -d` →
waits for `/api/health` and prints `OK: deployed <commit>` (or the logs and the
rollback command if it fails). The build takes a few minutes; the old container
keeps serving until the new one is ready, so downtime is only a few seconds.

**Quick checks afterwards**

```bash
docker compose ps                           # rianiregho-web: Up (healthy)
curl -s https://rianiregho.com/api/health   # {"status":"ok"}
docker compose logs --tail=50 web           # no errors
```

Then open the site and try what you changed (and log in once if auth was touched).

### What to do for each kind of change

| You changed...                                        | Do this on the server                                                                                                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages, components, API routes, styles, dependencies   | `./deploy/update.sh`                                                                                                                                       |
| `Dockerfile` or `docker-compose.yml`                  | `./deploy/update.sh` (it rebuilds and recreates the container)                                                                                             |
| A **database table or column** (new file in `db/migrations/`) | Run the migration **first**, then deploy: `docker exec -i pgdb psql -U postgres -d rianiregho_web < db/migrations/00X_name.sql` after `git pull`, then `./deploy/update.sh`. Keep migrations additive and idempotent so the old version keeps working until the new one is up. |
| An environment variable (`.env.production`)           | Edit the file, then `docker compose up -d`. A plain `restart` does **not** re-read it.                                                                      |
| `NEXT_PUBLIC_*` values (build args in `docker-compose.yml`) | They are baked into the browser bundle: redeploy with `./deploy/update.sh` so the image is rebuilt.                                                  |
| The Apache config (`deploy/apache-rianiregho.conf`)   | Copy it to `/etc/apache2/sites-available/rianiregho-web.conf` **and** apply the same change to certbot's `rianiregho-web-le-ssl.conf`, then `apache2ctl configtest && systemctl reload apache2`. The container does not need a rebuild. |
| Only uploaded content (photos, text via the admin)    | Nothing: it is saved straight to the database and the uploads folder.                                                                                       |

### If something goes wrong

- **`update.sh` says "Not possible to fast-forward" or complains about local changes**
  - the server's checkout differs from `origin/main`. Look with `git status` and
  `git diff`. If the edits are not needed: `git checkout -- . && ./deploy/update.sh`.
  Never edit code directly on the server; change it locally and push.
- **Build fails or the health check fails after a deploy** — the script prints the
  logs. Either fix and push again, or go back to the last working image:
  ```bash
  docker tag rianiregho-web:previous rianiregho-web:latest
  docker compose up -d --no-build
  ```
  This only undoes the *running* container. To also undo the code, `git revert`
  the bad commit locally and push, so `main` is good again.
- **`Permission denied` running the script** — run it as `bash deploy/update.sh`.
- **Server disk filling up with old images** — `docker image prune -f` runs on
  every deploy; occasionally also run `docker builder prune -f`.
- **Deploy without Git** — from your machine, `./deploy/deploy.sh` copies your
  working tree over SSH (see section 2, Option B).

---

## 1. One-time server setup

SSH to the server (use an SSH key; see [Hardening](#8-hardening-recommended)).

### 1.1 Create folders

```bash
mkdir -p /var/www/rp/rianiregho-web-uploads
# The container runs as uid/gid 1001 and must be able to write uploads:
chown -R 1001:1001 /var/www/rp/rianiregho-web-uploads
```

### 1.2 Copy the existing uploaded images

The old Laravel API stored images in `storage/app/public` (its folder has since
been removed from this server, so use a backup or a local copy). The paths saved
in the database (e.g. `projects/images/abc.png`) are relative, so a straight copy
of that folder's contents is all that is needed:

```bash
rsync -a /var/www/rp/rianiregho-web-api/storage/app/public/ /var/www/rp/rianiregho-web-uploads/
chown -R 1001:1001 /var/www/rp/rianiregho-web-uploads
ls /var/www/rp/rianiregho-web-uploads        # projects, project-gallery, work-experience-*
```

### 1.3 Database changes

The Gallery feature needs two tables. They were already created on the live
database; the script is idempotent, so running it again is harmless (and it is
how you set up a fresh database):

```bash
docker exec -i pgdb psql -U postgres -d rianiregho_web < db/migrations/001_create_galleries.sql
```

(Run it from the app folder after the first clone.)

### 1.4 Create `.env.production`

```bash
cd /var/www/rp/rianiregho-web
cp deploy/env.production.example .env.production
nano .env.production
chmod 600 .env.production
```

Fill in:

| Variable          | Value                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`    | `postgresql://postgres:<URL-ENCODED-PASSWORD>@host.docker.internal:5432/rianiregho_web`                |
| `AUTH_SECRET`     | `openssl rand -base64 32` (keep it private; changing it logs everyone out)                             |
| `AUTH_TRUST_HOST` | `true`                                                                                                 |
| `UPLOAD_DIR`      | `/data/uploads`                                                                                        |

URL-encode special characters in the DB password (`?` → `%3F`, `@` → `%40`,
`#` → `%23`, `/` → `%2F`).

No `AUTH_URL` is needed: the site address is read from the proxied request.

Also create a one-line `.env` (used by `docker compose` for the uploads volume):

```bash
echo 'UPLOADS_HOST_DIR=/var/www/rp/rianiregho-web-uploads' > .env && chmod 600 .env
```

---

## 2. First deploy (and the other ways to deploy)

### Option A — push to Git, pull on the server (recommended)

**One-time, private repos only:** if the repository is public, skip this and clone
over HTTPS. Otherwise let the server read it: create a
read-only deploy key on the server and add the public key in GitHub
(*Repo → Settings → Deploy keys*, leave "write access" off):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/rianiregho_deploy -N "" -C "rianiregho-web deploy"
cat ~/.ssh/rianiregho_deploy.pub            # paste this into GitHub
printf 'Host github.com\n  IdentityFile ~/.ssh/rianiregho_deploy\n  IdentitiesOnly yes\n' >> ~/.ssh/config
ssh -T git@github.com                        # should greet you
```

**First time — clone, then add the secrets file** (it is not in Git):

```bash
cd /var/www/rp
git clone https://github.com/rrrgho/rianiregho-web.git rianiregho-web   # public repo. Private: git@github.com:rrrgho/rianiregho-web.git
cd rianiregho-web
# create .env.production now — see step 1.4
./deploy/update.sh
```

**Every update:** see [Redeploy after you change the project](#redeploy-after-you-change-the-project):

```bash
cd /var/www/rp/rianiregho-web && ./deploy/update.sh
```

`update.sh` runs `git pull --ff-only`, rebuilds the image, restarts the container
and waits for `/api/health`. It uses branch `main` (override with
`DEPLOY_BRANCH=...`). If the server's checkout has local edits, the fast-forward
pull stops instead of overwriting them.

### Option B — push the source from your machine with rsync

If you do not want the server to have repository access, `./deploy/deploy.sh`
(run on your Mac) copies the working tree to the server over SSH (rsync, not
SFTP) and does the same build and restart. It never uploads `.env*` or `storage/`.

### Or do it by hand

```bash
cd /var/www/rp/rianiregho-web
git pull --ff-only
docker compose build && docker compose up -d
```

Check it:

```bash
docker compose ps                          # State: running, Health: healthy
curl -s http://127.0.0.1:8021/api/health   # {"status":"ok"}
docker compose logs -f web
```

> The first build takes a few minutes (the server has ~4 GB of free RAM, enough
> for the build; if it is ever killed for memory, add swap or build the image on
> your Mac with `docker build`, then `docker save | ssh ... docker load`).

### Test before pointing the domain at it

Nothing is public yet — the container only listens on the server's loopback. From
your Mac:

```bash
ssh -L 8021:127.0.0.1:8021 root@31.97.107.242
# then open http://localhost:8021
```

Check: home, Projects, Gallery, images load, `/login` works with
`rianiregho@gmail.com`, admin pages load, upload a photo.

---

## 3. Apache + HTTPS

```bash
sudo cp deploy/apache-rianiregho.conf /etc/apache2/sites-available/rianiregho-web.conf
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo a2ensite rianiregho-web
sudo apache2ctl configtest && sudo systemctl reload apache2
```

The vhost serves `rianiregho.com` and `www.rianiregho.com`. Edit `ServerName` /
`ServerAlias` if you use different names. Then add HTTPS:

```bash
sudo certbot --apache -d rianiregho.com -d www.rianiregho.com
```

certbot creates the `:443` vhost (copying the proxy directives) and the
HTTP→HTTPS redirect. The `X-Forwarded-Proto` header is set from the request
scheme, so it becomes `https` in the new vhost automatically.

> **Existing sites are not affected.** Apache picks the vhost by hostname; the
> other projects keep their own `ServerName`.

---

## 4. DNS cut-over (this moves the live site)

Today `rianiregho.com` goes through **Cloudflare** and `www.rianiregho.com`
points at **Vercel**. Switching means:

1. In Cloudflare DNS, point `rianiregho.com` and `www` (A records) to
   `31.97.107.242`.
2. If the records stay proxied (orange cloud), set Cloudflare SSL/TLS mode to
   **Full (strict)** once the origin certificate is installed. If certbot's HTTP
   challenge is blocked by the proxy, temporarily set the records to DNS-only
   (grey cloud) while issuing the certificate, or use a Cloudflare Origin
   Certificate.
3. Remove or disable the domain in Vercel once traffic has moved.

Do the cut-over only after section 2's checks pass. DNS changes can take a while to
spread, so keep the old deployment until you are sure.

---

## 5. After cut-over: retire the Laravel API

The Laravel app (`iregho-api.doiscode.com`) still points at the **same database**.
Once the new site is verified:

```bash
sudo a2dissite riangho-web-api riangho-web-api-le-ssl
sudo systemctl reload apache2
```

Keep `/var/www/rp/rianiregho-web-api` for a few weeks as a safety net,
then archive it. Do not leave both writing to the database.

---

## 6. Everyday operations

| Task                         | Command (in the app folder)                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| Logs                         | `docker compose logs -f web`                                          |
| Restart                      | `docker compose restart web`                                          |
| Stop                         | `docker compose down`                                                 |
| Rebuild after a code change  | push to `main`, then `./deploy/update.sh` on the server               |
| Change env vars              | edit `.env.production`, then `docker compose up -d`                   |
| Shell inside the container   | `docker compose exec web sh`                                          |

`NEXT_PUBLIC_*` values (`/api`, `/storage/`) are baked into the browser bundle at
build time, so changing them needs a rebuild.

### Roll back

```bash
docker tag rianiregho-web:previous rianiregho-web:latest
docker compose up -d --no-build
```

### Add or reset the admin login

Passwords are bcrypt hashes in `users.password`. To set one without storing a
plain password in a file, generate the hash on any machine with Node:

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'NEW_PASSWORD'
```

then `UPDATE users SET password = '<hash>' WHERE email = '...';`. Clearing a
user's password (`SET password = NULL`) disables their login.

---

## 7. Backups

Two things hold all the data: the database and the uploads folder.

```bash
# Database dump (put in cron, e.g. daily)
docker exec pgdb pg_dump -U postgres rianiregho_web | gzip > /var/backups/rianiregho_web_$(date +%F).sql.gz

# Uploaded images
rsync -a /var/www/rp/rianiregho-web-uploads/ /var/backups/rianiregho-uploads/
```

Copy them off the server too. Restore: `gunzip -c dump.sql.gz | docker exec -i pgdb psql -U postgres rianiregho_web`.

---

## 8. Hardening (recommended)

Found while setting this up — none of it blocks the deployment, but please act on it:

1. **`pgdb` does not restart after a reboot** (`RestartPolicy: no`). The site would
   be down until someone starts it. Fix: `docker update --restart unless-stopped pgdb`.
2. **Postgres port 5432 is open to the whole internet** (published on `0.0.0.0`) and
   the `postgres` superuser password is the same as the root SSH password. Rotate
   both. To close the port you must first check what else connects to it from
   outside (other projects on this server may use it), then rebind it
   (`127.0.0.1:5432`) — containers keep working through `host.docker.internal`.
3. **Use a least-privilege DB user** for this app instead of `postgres`:
   ```sql
   CREATE ROLE rianiregho_app LOGIN PASSWORD '...';
   GRANT CONNECT ON DATABASE rianiregho_web TO rianiregho_app;
   GRANT USAGE ON SCHEMA public TO rianiregho_app;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO rianiregho_app;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rianiregho_app;
   ```
   Then use it in `DATABASE_URL`.
4. **SSH:** use key-based login and disable root password login.
5. `database_connection_info.txt` in the repo folder holds plaintext credentials.
   It is excluded from Git and from the Docker image, but delete it from your
   machine once the passwords are rotated.

---

## 9. Troubleshooting

| Symptom                                           | Likely cause / fix                                                                                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container restarts / `unhealthy`                  | `docker compose logs web`. Usually a wrong `DATABASE_URL` (unencoded special character) or `pgdb` not running.                                       |
| `/api/health` returns 503                         | Cannot reach Postgres. Check `docker ps` for `pgdb` and that `host.docker.internal` resolves (`extra_hosts` in the compose file).                    |
| Login says "Missing secret" / error page          | `AUTH_SECRET` is empty in `.env.production`.                                                                                                        |
| Login bounces back to `/login`                    | Apache is not sending `X-Forwarded-Proto` / `ProxyPreserveHost On`, so cookies get the wrong `Secure` flag. Use the provided vhost.                  |
| Redirects to `0.0.0.0:3000`                       | The request bypassed Apache or `Host` was not forwarded. Use `ProxyPreserveHost On`.                                                                  |
| Images are broken (404 on `/storage/...`)         | Uploads not copied (step 1.2) or the volume path in `docker-compose.yml` is wrong.                                                                   |
| Upload fails with "permission denied"             | `chown -R 1001:1001 /var/www/rp/rianiregho-web-uploads`.                                                                                                |
| Upload fails with HTTP 413 / hangs                | A proxy limit. Apache: `LimitRequestBody 0` (in the vhost). Cloudflare free plan caps request bodies at 100 MB. The app itself allows 8 MB per photo. |
| Build killed (`exit 137`)                         | Out of memory on the server. Add swap or build on your Mac and load the image.                                                                       |
| Changed `.env.production` but nothing changed     | Run `docker compose up -d` (restart alone does not re-read the file).                                                                               |

---

## 10. Notes

- **Login rate limit** (5 failed attempts per minute) is kept in memory, so it
  resets on restart. Fine for a single container.
- **Soft deletes:** deleting a project, experience or gallery marks it deleted
  (`deleted_at`) and keeps its files; deleting a single photo removes the file.
- The container runs as a non-root user with `no-new-privileges` and a 768 MB
  memory cap.
