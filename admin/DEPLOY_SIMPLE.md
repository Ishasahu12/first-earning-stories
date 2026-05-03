# Deploy Admin Panel - Simple Method

## Option 1: Deploy Directly from Your Computer (Easiest)

Open terminal in VS Code and run:

```bash
cd admin
npx wrangler pages deploy . --project-name=first-earning-admin
```

**That's it!** It will ask you to login to Cloudflare (opens browser), then deploy immediately.

---

## Option 2: If Option 1 Doesn't Work

### Step 1: Make sure you're in the admin folder
```bash
cd admin
```

### Step 2: Deploy
```bash
npx wrangler pages deploy . --project-name=first-earning-admin --branch=main
```

### If it says "Project not found":

You need to create the project first (one time only):

1. Go to https://dash.cloudflare.com
2. Login with: **itsisha712@gmail.com**
3. Click **Pages** in left sidebar
4. Click **Create a project**
5. Choose **Upload assets**
6. Enter name: `first-earning-admin`
7. Click **Create project**
8. Now run the deploy command again (Step 2 above)

---

## After Deployment

Your admin panel will be at:
```
https://first-earning-admin.pages.dev
```

**Password**: `FESadmin2024!`

---

## Alternative: Deploy Everything at Once

If you want to deploy frontend + admin together:

```bash
# Deploy frontend (root folder)
npx wrangler pages deploy . --project-name=first-earning-stories

# Deploy admin panel
cd admin
npx wrangler pages deploy . --project-name=first-earning-admin
```

---

## Troubleshooting

**"Not authorized" error**: 
- Run `npx wrangler login` first, then try again

**"Project not found" error**: 
- Create the project in Cloudflare dashboard first (see Step 6 in Option 2)

**"Authentication error"**: 
- Make sure you're logged into the right Cloudflare account (itsisha712@gmail.com)

---

## Need the Backend Too?

After admin is deployed, deploy the backend:

```bash
cd backend
npm install
npx wrangler d1 create first-earning-stories-db
# Copy the database ID and paste it in backend/wrangler.toml
npx wrangler d1 migrations apply first-earning-stories-db --local
npx wrangler deploy
```
