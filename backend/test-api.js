// Test script for API endpoints
// Run with: node test-api.js

const BASE_URL = 'http://localhost:8787'

async function test() {
  console.log('🧪 Testing First Earning Stories API\n')

  // Test 1: Health check
  console.log('1. Testing health endpoint...')
  const health = await fetch(`${BASE_URL}/`)
  console.log('   Status:', health.status)
  console.log('   Response:', await health.json())
  console.log('')

  // Test 2: Get categories
  console.log('2. Testing categories endpoint...')
  const categories = await fetch(`${BASE_URL}/api/categories`)
  console.log('   Status:', categories.status)
  const catData = await categories.json()
  console.log('   Categories:', catData.data.length)
  console.log('')

  // Test 3: Get stories
  console.log('3. Testing stories list...')
  const stories = await fetch(`${BASE_URL}/api/stories`)
  console.log('   Status:', stories.status)
  const storyData = await stories.json()
  console.log('   Stories:', storyData.data.length)
  console.log('')

  // Test 4: Get single story
  if (storyData.data.length > 0) {
    console.log('4. Testing single story...')
    const single = await fetch(`${BASE_URL}/api/stories/${storyData.data[0].id}`)
    console.log('   Status:', single.status)
    const singleData = await single.json()
    console.log('   Story:', singleData.data.character_name)
    console.log('')
  }

  // Test 5: Get stats
  console.log('5. Testing stats endpoint...')
  const stats = await fetch(`${BASE_URL}/api/stats`)
  console.log('   Status:', stats.status)
  console.log('   Stats:', await stats.json())
  console.log('')

  console.log('✅ All tests completed!')
}

test().catch(console.error)
