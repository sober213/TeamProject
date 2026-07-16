const STORAGE_KEY = 'seoul_community_posts_v1'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('communityStorage: read error', e)
    return []
  }
}

function writeAll(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

function genId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}

export function getPosts() {
  return readAll()
}

export function getPost(id) {
  return readAll().find(p => p.id === id) || null
}

export function createPost({ title, content, password }) {
  const posts = readAll()
  const post = {
    id: genId(),
    title: title || '(제목 없음)',
    content: content || '',
    password: password || '',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  }
  posts.unshift(post)
  writeAll(posts)
  return post
}

export function updatePost(id, { title, content, password }) {
  const posts = readAll()
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  posts[idx] = {
    ...posts[idx],
    title: title ?? posts[idx].title,
    content: content ?? posts[idx].content,
    // allow password change if provided
    password: password !== undefined && password !== null ? password : posts[idx].password,
    updatedAt: new Date().toISOString(),
  }
  writeAll(posts)
  return posts[idx]
}

export function deletePost(id) {
  const posts = readAll()
  const filtered = posts.filter(p => p.id !== id)
  writeAll(filtered)
  return true
}
