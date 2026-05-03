# 🚀 Automatic Deployment Setup

## What is this?

I've set up **GitHub Actions** so your website deploys automatically when you push code to GitHub. No manual Cloudflare dashboard needed!

## How it works:
1. You push code to GitHub
2. GitHub automatically deploys to Cloudflare
3. Your website updates in ~2 minutes

## Setup (One-time, 5 minutes)

### Step 1: Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) (login with: itsisha712@gmail.com)
2. Click your profile picture (top right) → **My Profile**
3. Go to **API Tokens** tab
4. Click **Create Token**
5. Scroll down to **Custom token** → Click **Get started**
6. Fill in:
   - **Token name**: `GitHub Actions Deploy`
   - **Permissions**:
     - Zone:Read
     - Cloudflare Pages:Edit
     - Workers Scripts:Edit
     - Workers KV Storage:Edit
     - D1:Edit
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones (or your specific domain)
7. Click **Continue to summary** → **Create token**
8. **COPY THE TOKEN IMMEDIATELY** (you can't see it again!)

### Step 2: Get Account ID

1. In Cloudflare Dashboard, look at the right sidebar
2. You'll see **Account ID** - copy it

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repo: https://github.com/Ishasahu12/first-earning-stories
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add these two secrets:

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: (paste the token from Step 1)

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: (paste the account ID from Step 2)

6. Click **Add secret** for each

### Step 4: Create Pages Projects (One-time)

You need to create the projects in Cloudflare first (just the name, we'll handle the rest):

**For Admin Panel:**
1. Cloudflare Dashboard → **Pages**
2. **Create a project**
3. **Upload assets**
4. Project name: `first-earning-admin`
5. Click **Create project**

**For Frontend** (if not already created):
1. Cloudflare Dashboard → **Pages**
2. **Create a project**
3. **Upload assets**
4. Project name: `first-earning-stories`
5. Click **Create project**

### Step 5: Deploy!

Just push any change to GitHub:
```bash
git push origin main
```

Or go to GitHub → Actions tab → Click **Run workflow**

## What Gets Deployed?

| File/Folder | Deploys To | URL |
|-------------|-----------|-----|
| `index.html`, `read.html`, `write.html` | Cloudflare Pages | `https://first-earning-stories.pages.dev` |
| `admin/` folder | Cloudflare Pages | `https://first-earning-admin.pages.dev` |
| `backend/` folder | Cloudflare Workers | `https://first-earning-stories-api.your-account.workers.dev` |

## Monitoring Deployments

1. Go to your GitHub repo
2. Click **Actions** tab
3. See all deployments in real-time
4. Green checkmark = deployed successfully
5. Red X = something went wrong (click to see error)

## Troubleshooting

### "Project not found" error
- Make sure you created the Pages projects in Step 4
- Project names must match exactly: `first-earning-stories` and `first-earning-admin`

### "Authentication error" 
- Check that your API token is correct
- Make sure the token has the right permissions (Pages:Edit, Workers Scripts:Edit)

### Backend not deploying
- Make sure `wrangler.toml` has the correct database ID
- Check that D1 database exists in Cloudflare

## Current Password for Admin

**Password**: `FESadmin2024!`

Change it in `admin/app.js` line 5, then push to GitHub to redeploy.

## Need Help?

If you get stuck on any step, tell me:
1. Which step you're on
2. What error you see
3. Screenshot if possible

I'll guide you through it.
