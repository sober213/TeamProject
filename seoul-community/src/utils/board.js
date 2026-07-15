const STORAGE_KEY = 'board_posts_v1';

function readRaw() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeRaw(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function getPosts() {
  return readRaw().slice().sort((a,b)=>b.createdAt - a.createdAt);
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

export function addPost({ title, body, password }) {
  const posts = readRaw();
  const post = {
    id: genId(),
    title: title || '(제목없음)',
    body: body || '',
    passwordPlain: password || '',
    createdAt: Date.now()
  };
  posts.push(post);
  writeRaw(posts);
  return post;
}

export function findPost(id) {
  return readRaw().find(p => p.id === id) || null;
}

export function updatePost(id, { title, body, password }) {
  const posts = readRaw();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return { ok:false, reason:'not-found' };
  if (posts[idx].passwordPlain !== (password || '')) return { ok:false, reason:'bad-password' };
  posts[idx] = { ...posts[idx], title: title || posts[idx].title, body: body || posts[idx].body, modifiedAt: Date.now() };
  writeRaw(posts);
  return { ok:true, post: posts[idx] };
}

export function deletePost(id, password) {
  const posts = readRaw();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return { ok:false, reason:'not-found' };
  if (posts[idx].passwordPlain !== (password || '')) return { ok:false, reason:'bad-password' };
  posts.splice(idx,1);
  writeRaw(posts);
  return { ok:true };
}