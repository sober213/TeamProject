<template>
  <div class="community-board">
    <div class="board-header">
      <h2>서울 카테고리 게시판 (익명)</h2>
      <button @click="openNew">새 글 작성</button>
    </div>

    <div class="board-body">
      <CommunityList :posts="posts" @select="openDetail" />

      <div class="panel">
        <component
          :is="panelComponent"
          v-bind="panelProps"
          @save="onSave"
          @cancel="closePanel"
          @edit-request="onEditRequest"
          @delete-request="onDeleteRequest"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CommunityList from './CommunityList.vue'
import CommunityDetail from './CommunityDetail.vue'
import CommunityForm from './CommunityForm.vue'
import * as storage from '../../utils/communityStorage'

const posts = ref(storage.getPosts())
const active = ref(null) // { type: 'detail'|'form', postId?, post? }

function refresh() {
  posts.value = storage.getPosts()
  // 게시판을 열면 최신글을 본 것으로 처리 (알림 자동 소거)
  const latestId = posts.value && posts.value.length ? posts.value[0].id : null
  if (latestId) localStorage.setItem('community_last_seen_id', latestId)
}

function openNew() {
  active.value = { type: 'form', post: null }
}

function openDetail(postId) {
  const p = storage.getPost(postId)
  active.value = { type: 'detail', post: p }
}

function closePanel() {
  active.value = null
}

async function onSave(payload) {
  // payload: {id?, title, content, password}
  if (payload.id) {
    // edit flow: verify password
    const existing = storage.getPost(payload.id)
    if (!existing) {
      alert('게시글을 찾을 수 없습니다.')
      return
    }
    if (existing.password !== payload.password) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    storage.updatePost(payload.id, payload)
    refresh()
    active.value = { type: 'detail', post: storage.getPost(payload.id) }
  } else {
    // create
    const newPost = storage.createPost(payload)
    refresh()
    active.value = { type: 'detail', post: newPost }
  }
}

function onEditRequest(postId) {
  const p = storage.getPost(postId)
  active.value = { type: 'form', post: p }
}

function onDeleteRequest(postId) {
  const pwd = prompt('삭제하려면 비밀번호를 입력하세요')
  if (pwd === null) return
  const p = storage.getPost(postId)
  if (!p) { alert('게시글을 찾을 수 없습니다.'); return }
  if (p.password !== pwd) { alert('비밀번호가 일치하지 않습니다.'); return }
  storage.deletePost(postId)
  refresh()
  active.value = null
}

const panelComponent = computed(() => {
  if (!active.value) return { template: '<div>게시글을 선택하거나 새 글을 작성하세요.</div>' }
  return active.value.type === 'detail' ? CommunityDetail : CommunityForm
})

const panelProps = computed(() => ({ post: active.value ? active.value.post : null }))
</script>

<style scoped>
.community-board {
  max-width: 980px;
  margin: 0 auto;
}
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.board-body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
}
.panel {
  background: #fff;
  border: 1px solid #e6e9ef;
  padding: 12px;
}
</style>
