# Admin Panel - First Earning Stories

## What is this?
A simple, secure admin dashboard to manage your First Earning Stories website.

## Features
- 📊 **Dashboard Stats** - See total stories, visitors, views, and today's activity
- 📝 **Story Management** - View, filter, and delete stories
- 🏷️ **Category Filtering** - Filter stories by category
- 🔍 **Story Preview** - Click to read full story content
- 🗑️ **Safe Deletion** - Confirm before deleting, with undo protection
- 📱 **Mobile Friendly** - Check stats on your phone
- 🔐 **Password Protected** - Simple password, no complex accounts

## Quick Start

### 1. Update Configuration
Open `app.js` and update:
```javascript
const CONFIG = {
  API_URL: 'https://your-api-url.workers.dev', // Your deployed API URL
  ADMIN_PASSWORD: 'your-secure-password', // Change this!
  STORIES_PER_PAGE: 10
};
```

### 2. Deploy
The admin panel is a static HTML site. Deploy it to Cloudflare Pages:

```bash
# From the admin directory
npx wrangler pages deploy . --project-name=first-earning-admin
```

Or host it anywhere (Netlify, Vercel, GitHub Pages, etc.)

### 3. Access
Go to your deployed URL and enter the password.

## Security

### Default Password
The default password is `admin123`. **Change this immediately** in `app.js`:

```javascript
ADMIN_PASSWORD: 'your-new-secure-password'
```

### Password Storage
- Password is hardcoded in `app.js` (simple but effective for single-user)
- No database or user accounts needed
- Session stored in browser localStorage (clears when you logout)

### Recommendation for Production
For better security, you can:
1. Set password as environment variable in Cloudflare Pages
2. Add rate limiting to prevent brute force
3. Use IP whitelisting (restrict to your home/office IP)

## API Endpoints Used

The admin panel connects to these backend endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stats` | GET | Load dashboard statistics |
| `/api/stories` | GET | List all stories |
| `/api/stories/:id` | GET | View single story |
| `/api/stories/:id` | DELETE | Delete story |
| `/api/categories` | GET | List categories |

## Customization

### Change Theme Colors
Edit CSS variables in `index.html`:
```css
:root {
  --bg: #1a1a1a;        /* Background */
  --accent: #FFF378;     /* Primary color */
  --danger: #ff6b6b;     /* Delete color */
  --success: #51cf66;    /* Success color */
}
```

### Add More Features
You can extend the admin panel with:
- Story editing (update existing stories)
- Category management (add/edit categories)
- Visitor analytics charts
- Export data to CSV
- Bulk actions (delete multiple stories)

## Troubleshooting

### "Unable to connect to API"
Update `API_URL` in `app.js` to your deployed backend URL.

### "Invalid password"
Check that you're using the password set in `CONFIG.ADMIN_PASSWORD`.

### Stories not showing
- Check browser console for errors
- Verify API is running: visit `https://your-api-url/api/stats`
- Check that database has data: `npx wrangler d1 execute DB --local --command="SELECT COUNT(*) FROM stories"`

## File Structure
```
admin/
├── index.html    # Admin dashboard UI
├── app.js        # Admin logic
└── README.md     # This file
```

## No Build Step Required
This is vanilla HTML/CSS/JS - no npm install, no build process, just deploy the files.

---

**Need help?** Check the main `BACKEND_SETUP.md` for full project documentation.
