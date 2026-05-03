# First Earning Stories - Backend API

## Architecture
- **Runtime**: Cloudflare Workers (Serverless)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (S3-compatible object storage)
- **Framework**: Hono (Lightweight web framework)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create D1 Database
```bash
npx wrangler d1 create first-earning-stories-db
```

This will output a database ID. Copy it and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "first-earning-stories-db"
database_id = "your-database-id-here"
```

### 3. Run Migrations
```bash
npx wrangler d1 migrations apply first-earning-stories-db --local
```

For production:
```bash
npx wrangler d1 migrations apply first-earning-stories-db
```

### 4. Create R2 Bucket
```bash
npx wrangler r2 bucket create first-earning-stories-images
```

### 5. Run Locally
```bash
npm run dev
```

### 6. Deploy
```bash
npm run deploy
```

## API Endpoints

### Stories
- `GET /api/stories` - List all stories
  - Query params: `?category=student&limit=10&offset=0`
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create new story
- `POST /api/stories/:id/view` - Increment views

### Categories
- `GET /api/categories` - List all categories

### Stats
- `GET /api/stats` - Platform statistics

### Upload
- `POST /api/upload` - Upload image
  - Form data: `image` (file)

## Database Schema

### stories
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| character_name | TEXT | Author's chosen name |
| category | TEXT | Story category |
| year | INTEGER | Year of earning (nullable) |
| story_text | TEXT | Full story |
| excerpt | TEXT | First sentence |
| emotion | TEXT | Emotion tag |
| views | INTEGER | View count |
| image_url | TEXT | R2 image URL |
| created_at | DATETIME | Auto timestamp |

## Environment Variables

Create a `.dev.vars` file for local development:
```
UPLOAD_TOKEN=your-secret-token
```

Set secrets for production:
```bash
npx wrangler secret put UPLOAD_TOKEN
```

## Connecting Frontend

Update your frontend JavaScript to call the API:
```javascript
const API_URL = 'https://your-worker.your-subdomain.workers.dev'

// Fetch stories
fetch(`${API_URL}/api/stories`)
  .then(res => res.json())
  .then(data => console.log(data))

// Create story
fetch(`${API_URL}/api/stories`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    character_name: 'Your Name',
    category: 'student',
    year: 2024,
    story_text: 'Your story here...',
    emotion: 'proud'
  })
})
```

## Reverting to Frontend Only

If you need to go back to just the frontend:
```bash
git checkout working-frontend-v1
```

All backend files are in `/backend/` and won't affect the frontend.
