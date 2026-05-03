// Admin Panel JavaScript
// Configuration - Update these after deployment
const CONFIG = {
  API_URL: 'https://first-earning-stories-api.your-account.workers.dev', // Will be updated after backend deployment
  ADMIN_PASSWORD: 'FESadmin2024!', // Admin access password - CHANGE THIS AFTER FIRST LOGIN
  STORIES_PER_PAGE: 10
};

// State
let currentPage = 1;
let stories = [];
let categories = [];
let storyToDelete = null;
let currentFilter = 'all';
let currentCategory = 'all';

// ==================== AUTH ====================

function login() {
  const password = document.getElementById('passwordInput').value;
  const errorEl = document.getElementById('loginError');
  
  if (password === CONFIG.ADMIN_PASSWORD) {
    localStorage.setItem('admin_auth', 'true');
    showDashboard();
    loadDashboard();
  } else {
    errorEl.classList.add('show');
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').focus();
  }
}

function logout() {
  localStorage.removeItem('admin_auth');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').classList.remove('show');
  document.getElementById('passwordInput').value = '';
}

function checkAuth() {
  if (localStorage.getItem('admin_auth') === 'true') {
    showDashboard();
    loadDashboard();
  }
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').classList.add('show');
}

// ==================== DATA LOADING ====================

async function loadDashboard() {
  await Promise.all([
    loadStats(),
    loadCategories(),
    loadStories()
  ]);
}

async function loadStats() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/api/stats`);
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('totalStories').textContent = data.data.total_stories || 0;
      document.getElementById('totalVisitors').textContent = data.data.total_visitors || 0;
      document.getElementById('totalViews').textContent = formatNumber(data.data.total_views || 0);
      document.getElementById('todayStories').textContent = data.data.today_stories || 0;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
    // Show demo data if API not connected
    document.getElementById('totalStories').textContent = '0';
    document.getElementById('totalVisitors').textContent = '0';
    document.getElementById('totalViews').textContent = '0';
    document.getElementById('todayStories').textContent = '0';
  }
}

async function loadCategories() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/api/categories`);
    const data = await response.json();
    
    if (data.success) {
      categories = data.data;
      renderCategoryFilters();
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadStories() {
  const tableBody = document.getElementById('storiesTable');
  tableBody.innerHTML = `
    <tr>
      <td colspan="7">
        <div class="loading">
          <div class="spinner"></div>
          <div>Loading stories...</div>
        </div>
      </td>
    </tr>
  `;

  try {
    let url = `${CONFIG.API_URL}/api/stories?limit=${CONFIG.STORIES_PER_PAGE}&offset=${(currentPage - 1) * CONFIG.STORIES_PER_PAGE}`;
    
    if (currentCategory !== 'all') {
      url += `&category=${currentCategory}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      stories = data.data;
      renderStories();
      renderPagination(data.count);
    }
  } catch (error) {
    console.error('Error loading stories:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-state-icon">📡</div>
            <div>Unable to connect to API</div>
            <div style="font-size: 0.85rem; margin-top: 0.5rem;">
              Update API_URL in app.js after deploying backend
            </div>
          </div>
        </td>
      </tr>
    `;
  }
}

// ==================== RENDERING ====================

function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  container.innerHTML = `<button class="filter-tab active" onclick="filterByCategory('all')">All Categories</button>`;
  
  categories.forEach(cat => {
    container.innerHTML += `<button class="filter-tab" onclick="filterByCategory('${cat.name}')">${cat.display_name}</button>`;
  });
}

function renderStories() {
  const tableBody = document.getElementById('storiesTable');
  
  if (stories.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <div>No stories found</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }
  
  tableBody.innerHTML = stories.map(story => `
    <tr>
      <td><strong>${escapeHtml(story.character_name)}</strong></td>
      <td><div class="story-preview">${escapeHtml(story.excerpt || story.story_text.substring(0, 100) + '...')}</div></td>
      <td><span class="category-badge">${escapeHtml(story.category)}</span></td>
      <td>${story.year || '-'}</td>
      <td>${story.views || 0}</td>
      <td>${formatDate(story.created_at)}</td>
      <td>
        <div class="actions">
          <button class="btn-icon view" onclick="viewStory(${story.id})" title="View">👁</button>
          <button class="btn-icon delete" onclick="deleteStory(${story.id})" title="Delete">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderPagination(totalCount) {
  const container = document.getElementById('pagination');
  const totalPages = Math.ceil(totalCount / CONFIG.STORIES_PER_PAGE);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous
  html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span style="color: var(--text-muted); padding: 0 0.5rem;">...</span>`;
    }
  }
  
  // Next
  html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
  
  container.innerHTML = html;
}

// ==================== ACTIONS ====================

function filterStories(filter) {
  currentFilter = filter;
  currentPage = 1;
  
  // Update button states
  document.querySelectorAll('.section-actions .btn-sm').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  loadStories();
}

function filterByCategory(category) {
  currentCategory = category;
  currentPage = 1;
  
  // Update tab states
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  loadStories();
}

function goToPage(page) {
  currentPage = page;
  loadStories();
}

function viewStory(id) {
  const story = stories.find(s => s.id === id);
  if (!story) return;
  
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="story-detail-meta">
      <span><span class="label">Author:</span> ${escapeHtml(story.character_name)}</span>
      <span><span class="label">Category:</span> <span class="category-badge">${escapeHtml(story.category)}</span></span>
      <span><span class="label">Year:</span> ${story.year || 'Not specified'}</span>
      <span><span class="label">Views:</span> ${story.views || 0}</span>
      <span><span class="label">Date:</span> ${formatDate(story.created_at)}</span>
    </div>
    <div class="story-text-full">${escapeHtml(story.story_text)}</div>
  `;
  
  openModal('viewModal');
}

function deleteStory(id) {
  const story = stories.find(s => s.id === id);
  if (!story) return;
  
  storyToDelete = id;
  document.getElementById('deleteStoryPreview').innerHTML = `
    <strong>"${escapeHtml(story.character_name)}"</strong> — ${escapeHtml(story.excerpt || story.story_text.substring(0, 80) + '...')}
  `;
  
  openModal('deleteModal');
}

async function confirmDelete() {
  if (!storyToDelete) return;
  
  try {
    const response = await fetch(`${CONFIG.API_URL}/api/stories/${storyToDelete}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal('deleteModal');
      storyToDelete = null;
      loadStories();
      loadStats();
      
      // Show success (you could add a toast notification here)
      console.log('Story deleted successfully');
    } else {
      alert('Error: ' + (data.error || 'Failed to delete story'));
    }
  } catch (error) {
    console.error('Error deleting story:', error);
    alert('Error deleting story. Check console for details.');
  }
}

// ==================== MODALS ====================

function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(modal => {
      modal.classList.remove('show');
    });
    document.body.style.overflow = '';
  }
});

// ==================== UTILITIES ====================

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
