const KEY = 'sc_boards_v1';

// 게시글 스키마:
// { id: string, title: string, body: string, password: string, contentid?: string, createdAt: ISOString, updatedAt?: ISOString }

export function loadBoards() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBoards(boards) {
  localStorage.setItem(KEY, JSON.stringify(boards));
}

export function addBoard({ title, body, password, contentid = null }) {
  const boards = loadBoards();
  const board = {
    id: Date.now().toString(),
    title,
    body,
    password,
    contentid,
    createdAt: new Date().toISOString()
  };
  boards.unshift(board);
  saveBoards(boards);
  return board;
}

export function updateBoard(id, password, updates) {
  const boards = loadBoards();
  const idx = boards.findIndex(b => b.id === id);
  if (idx === -1) return { ok:false, reason:'not-found' };
  if (boards[idx].password !== password) return { ok:false, reason:'bad-password' };
  boards[idx] = { ...boards[idx], ...updates, updatedAt: new Date().toISOString() };
  saveBoards(boards);
  return { ok:true, board: boards[idx] };
}

export function deleteBoard(id, password) {
  const boards = loadBoards();
  const idx = boards.findIndex(b => b.id === id);
  if (idx === -1) return { ok:false, reason:'not-found' };
  if (boards[idx].password !== password) return { ok:false, reason:'bad-password' };
  boards.splice(idx,1);
  saveBoards(boards);
  return (saveBoards(boards), { ok:true });
}