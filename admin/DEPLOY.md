# Admin Panel Deployment Guide

## Step 1: Create Pages Project (One-time setup)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Pages** in the left sidebar
3. Click **Create a project**
4. Choose **Upload assets** (not Git integration)
5. Project name: `first-earning-admin`
6. Click **Create project**

## Step 2: Deploy

After creating the project, run:
```bash
cd admin
npx wrangler pages deploy . --project-name=first-earning-admin
```

## Step 3: Access Your Admin Panel

Your admin panel will be at:
```
https://first-earning-admin.pages.dev
```

## Step 4: Change Password (IMPORTANT)

1. Open `admin/app.js`
2. Find: `ADMIN_PASSWORD: 'FESadmin2024!'`
3. Change to your own secure password
4. Redeploy:
```bash
npx wrangler pages deploy . --project-name=first-earning-admin
```

## Current Password

**Temporary password**: `FESadmin2024!`

**Change this immediately after first login!**

## Features

After deployment, you'll have:
- Dashboard with stats
- Story management table
- Delete functionality
- Category filtering
- Mobile responsive

## Troubleshooting

### "Project not found"
Create the project in Cloudflare dashboard first (Step 1 above).

### Can't login
Check that you're using the password from `app.js` line 5.

### No stories showing
Backend API needs to be deployed first. Update `API_URL` in `app.js` after backend deployment.
