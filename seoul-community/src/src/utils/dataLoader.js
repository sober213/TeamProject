// 경로 예시: '/data/서울/서울_관광지.json' — 파일은 public/data/서울/ 아래에 둡니다.

export async function fetchJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('fetch failed: ' + res.status);
  return res.json();
}

export function normalizeItem(item) {
  return {
    contentid: item.contentid,
    contenttypeid: item.contenttypeid,
    title: item.title,
    addr1: item.addr1 || '',
    mapx: item.mapx ? parseFloat(item.mapx) : null,
    mapy: item.mapy ? parseFloat(item.mapy) : null,
    firstimage: item.firstimage || item.firstimage2 || '',
    // 필요한 다른 필드만 선택
    eventstartdate: item.eventstartdate ?? null,
    eventenddate: item.eventenddate ?? null
  };
}

export async function loadContentList({ filename, page=1, pageSize=50 }) {
  // filename: '/data/서울/서울_관광지.json'
  const json = await fetchJson(filename);
  const items = json.items || [];
  const start = (page-1)*pageSize;
  const slice = items.slice(start, start + pageSize).map(normalizeItem);
  return { total: json.total || items.length, items: slice };
}