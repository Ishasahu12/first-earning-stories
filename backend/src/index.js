import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
app.use('*', logger())

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'First Earning Stories API',
    version: '1.0.0',
    status: 'running'
  })
})

// ==================== STORIES ====================

// GET /api/stories - List all stories
app.get('/api/stories', async (c) => {
  const db = c.env.DB
  const category = c.req.query('category')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')

  try {
    let query = 'SELECT * FROM stories'
    let params = []

    if (category && category !== 'all') {
      query += ' WHERE category = ?'
      params.push(category)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const { results } = await db.prepare(query).bind(...params).all()

    return c.json({
      success: true,
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return c.json({ success: false, error: 'Failed to fetch stories' }, 500)
  }
})

// GET /api/stories/:id - Get single story
app.get('/api/stories/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  try {
    const story = await db.prepare('SELECT * FROM stories WHERE id = ?').bind(id).first()

    if (!story) {
      return c.json({ success: false, error: 'Story not found' }, 404)
    }

    return c.json({
      success: true,
      data: story
    })
  } catch (error) {
    console.error('Error fetching story:', error)
    return c.json({ success: false, error: 'Failed to fetch story' }, 500)
  }
})

// POST /api/stories - Create new story
app.post('/api/stories', async (c) => {
  const db = c.env.DB

  try {
    const body = await c.req.json()
    
    // Validation
    if (!body.story_text || !body.character_name || !body.category) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: story_text, character_name, category' 
      }, 400)
    }

    // Generate excerpt (first sentence or first 150 chars)
    const excerpt = body.excerpt || body.story_text.split(/[.!?]/)[0].substring(0, 150) + '...'

    const result = await db.prepare(`
      INSERT INTO stories (character_name, category, year, story_text, excerpt, emotion, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.character_name,
      body.category.toLowerCase(),
      body.year || null,
      body.story_text,
      excerpt,
      body.emotion || null,
      body.image_url || null
    ).run()

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        character_name: body.character_name,
        category: body.category,
        message: 'Story created successfully'
      }
    }, 201)
  } catch (error) {
    console.error('Error creating story:', error)
    return c.json({ success: false, error: 'Failed to create story' }, 500)
  }
})

// POST /api/stories/:id/view - Increment view count
app.post('/api/stories/:id/view', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  try {
    await db.prepare('UPDATE stories SET views = views + 1 WHERE id = ?').bind(id).run()
    
    return c.json({
      success: true,
      message: 'View count incremented'
    })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return c.json({ success: false, error: 'Failed to update views' }, 500)
  }
})

// ==================== CATEGORIES ====================

// GET /api/categories - List all categories
app.get('/api/categories', async (c) => {
  const db = c.env.DB

  try {
    const { results } = await db.prepare('SELECT * FROM categories ORDER BY display_name').all()

    return c.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500)
  }
})

// DELETE /api/stories/:id - Delete story
app.delete('/api/stories/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  try {
    await db.prepare('DELETE FROM stories WHERE id = ?').bind(id).run()
    
    return c.json({
      success: true,
      message: 'Story deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting story:', error)
    return c.json({ success: false, error: 'Failed to delete story' }, 500)
  }
})

// ==================== STATS ====================

// GET /api/stats - Get platform stats
app.get('/api/stats', async (c) => {
  const db = c.env.DB

  try {
    const totalStories = await db.prepare('SELECT COUNT(*) as count FROM stories').first()
    const totalViews = await db.prepare('SELECT SUM(views) as total FROM stories').first()
    const categories = await db.prepare('SELECT COUNT(*) as count FROM categories').first()
    
    // Get today's stories
    const today = new Date().toISOString().split('T')[0]
    const todayStories = await db.prepare(
      "SELECT COUNT(*) as count FROM stories WHERE DATE(created_at) = ?"
    ).bind(today).first()

    return c.json({
      success: true,
      data: {
        total_stories: totalStories.count,
        total_views: totalViews.total || 0,
        total_categories: categories.count,
        today_stories: todayStories.count
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500)
  }
})

// ==================== IMAGE UPLOAD ====================

// POST /api/upload - Upload image to R2
app.post('/api/upload', async (c) => {
  const bucket = c.env.STORIES_BUCKET

  try {
    const formData = await c.req.formData()
    const file = formData.get('image')

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No image file provided' }, 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return c.json({ success: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF' }, 400)
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return c.json({ success: false, error: 'File too large. Max 5MB' }, 400)
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `stories/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    // Upload to R2
    await bucket.put(filename, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Generate public URL
    const publicUrl = `https://pub-your-account.r2.dev/${filename}`

    return c.json({
      success: true,
      data: {
        url: publicUrl,
        filename: filename
      }
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return c.json({ success: false, error: 'Failed to upload image' }, 500)
  }
})

// Error handling
app.onError((err, c) => {
  console.error('Application error:', err)
  return c.json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: 'Not found' }, 404)
})

export default app
